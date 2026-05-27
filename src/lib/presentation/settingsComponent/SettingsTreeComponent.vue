<script setup lang="ts">
import BooleanSettingControl from '@/presentation/settingsComponent/BooleanSettingControl.vue';
import { computed } from 'vue';

import NumberSettingControl from '@/presentation/settingsComponent/NumberSettingControl.vue';

import StringSettingControl from '@/presentation/settingsComponent/StringSettingControl.vue';
import LabelTreeNodeComponent from '@/presentation/settingsComponent/LabelTreeNodeComponent.vue';
import type { AnyUpdateChoice, NumberSettingChoice, StringSettingChoice } from '@/presentation/settingsComponent/settingsChoice';
import type { SettingsTreeNode, ChoiceTreeNode, LabelTreeNode } from '@/presentation/settingsComponent/settingsTreeNodes';

const props = defineProps<{
    node: SettingsTreeNode
    hasChildren: boolean
    isCollapsed: boolean
    toggleCollapse: () => void
}>()

const emit = defineEmits<{
    (e: 'update:choice', update: AnyUpdateChoice): void
}>()

const choice = computed(() => {
    return (props.node as ChoiceTreeNode).choice
})

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
    <div class="settings__row">
        <LabelTreeNodeComponent
            v-if="node.type === 'LabelTreeNode'"
            :node="(node as LabelTreeNode)"
            :hasChildren="props.hasChildren"
            :isCollapsed="props.isCollapsed"
            @toggle-collapse="props.toggleCollapse">
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
</template>

<style scoped>

.settings__row {
    display: flex;
    align-items: center;
    gap: 0;
}

</style>
