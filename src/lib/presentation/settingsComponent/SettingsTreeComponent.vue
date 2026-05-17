<script setup lang="ts">
import BooleanSettingControl from '@/presentation/settingsComponent/BooleanSettingControl.vue';
import type { AnyUpdateChoice, ChoiceTreeNode, LabelTreeNode, NumberSettingChoice, SettingsTreeNode, StringSettingChoice } from '@/presentation/settingsComponent/settingsChoice';
import { computed } from 'vue';

import NumberSettingControl from '@/presentation/settingsComponent/NumberSettingControl.vue';

import StringSettingControl from '@/presentation/settingsComponent/StringSettingControl.vue';
import TreeDraw from '@/presentation/settingsComponent/TreeDraw.vue';
import LabelTreeNodeComponent from '@/presentation/settingsComponent/LabelTreeNodeComponent.vue';

const props = defineProps<{
    node: SettingsTreeNode,
    isLast? : boolean
    ancestorHasNext?: boolean[]
    depth?: number
    collapsedState?: Record<string, boolean>
}>()

const emit = defineEmits<{
    (e: 'update:choice', update: AnyUpdateChoice): void
    (e: 'toggle-collapse', id: string): void
}>()

const choice = computed(() => {
    return (props.node as ChoiceTreeNode).choice
})

const hasChildren = computed(() => (props.node.children?.length ?? 0) > 0)
const isLabelNode = computed(() => props.node.type === 'LabelTreeNode')
const ancestorHasNext = computed(() => props.ancestorHasNext ?? [])
const isLast = computed(() => props.isLast ?? false)
const depth = computed(() => props.depth ?? ancestorHasNext.value.length)
const isCollapsed = computed(() => (isLabelNode.value ? !!props.collapsedState?.[props.node.id] : false))
const childAncestorHasNext = computed(() => {
    if (depth.value === 0) {
        return []
    }
    return [...ancestorHasNext.value, !isLast.value]
})
const childDepth = computed(() => depth.value + 1)

function toggleCollapse() {
    if (hasChildren.value) {
        emit('toggle-collapse', props.node.id)
    }
}

function updateBooleanChoice(choiceId: string, value: boolean) {
    emit('update:choice', { id: choiceId, value })
}

function updateNumberChoice(choice: NumberSettingChoice, value: number) {
    emit('update:choice', { id: choice.id, value })
}

function updateStringChoice(choiceId: string, value: string) {
    emit('update:choice', { id: choiceId, value })
}

</script>

<template>
    <div class="settings__node">
        <div class="settings__row">
            <TreeDraw v-if="depth > 0" :isLast="isLast" :depth="depth" :ancestorHasNext="ancestorHasNext"></TreeDraw>

            <LabelTreeNodeComponent
                v-if="node.type === 'LabelTreeNode'"
                :node="(node as LabelTreeNode)"
                :hasChildren="hasChildren"
                :isCollapsed="isCollapsed"
                @toggle-collapse="toggleCollapse">
            </LabelTreeNodeComponent>

            <BooleanSettingControl v-else-if="typeof choice.value === 'boolean'" :label="choice.label" :value="choice.value"
                @update:value="(value) => updateBooleanChoice(choice.id, value)" />

            <NumberSettingControl v-else-if="typeof choice.value === 'number'" :label="choice.label" :value="choice.value"
                :min="(choice as NumberSettingChoice).min" :max="(choice as NumberSettingChoice).max"
                :format="(choice as NumberSettingChoice).format"
                @update:value="(value) => updateNumberChoice(choice as NumberSettingChoice, value)" />

            <StringSettingControl v-else-if="typeof choice.value === 'string'" :label="choice.label" :value="choice.value"
                :options="(choice as StringSettingChoice).options" :format="(choice as StringSettingChoice).format"
                @update:value="(value) => updateStringChoice(choice.id, value)" />
        </div>

        <div v-if="node.type === 'LabelTreeNode' && !isCollapsed" class="settings__children">
            <SettingsTreeComponent
                v-for="(tree, index) in props.node.children"
                :key="tree.id"
                :node="tree"
                :ancestorHasNext="childAncestorHasNext"
                :depth="childDepth"
                :isLast="index === props.node.children.length - 1"
                :collapsedState="props.collapsedState"
                @toggle-collapse="(id) => emit('toggle-collapse', id)"
                @update:choice="(update) => emit('update:choice', update)">
            </SettingsTreeComponent>
        </div>
    </div>
</template>

<style scoped>

.settings__row {
    display: flex;
    align-items: center;
    gap: 0;
}

.settings__node {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.settings__children {
    display: flex;
    flex-direction: column;
}

</style>
