<script setup lang="ts">
import BooleanSettingControl from '@/presentation/settingsComponent/BooleanSettingControl.vue';
import { computed } from 'vue';

import NumberSettingControl from '@/presentation/settingsComponent/NumberSettingControl.vue';

import StringSettingControl from '@/presentation/settingsComponent/StringSettingControl.vue';
import LabelTreeNodeComponent from '@/presentation/settingsComponent/LabelTreeNodeComponent.vue';
import type { AnyUpdateChoice, AnyUpdateChoiceValue, NumberSettingChoice, StringSettingChoice } from '@/presentation/settingsComponent/settingsChoice';
import type { SettingsTreeNode, ChoiceTreeNode, LabelTreeNode } from '@/presentation/settingsComponent/settingsTreeNodes';

const props = defineProps<{
    node: SettingsTreeNode
}>()

const emit = defineEmits<{
    (e: 'update:choice', update: AnyUpdateChoice): void
}>()

const choice = computed(() => {
    return (props.node as ChoiceTreeNode).choice
})

function updateChoice<T extends AnyUpdateChoiceValue>(choiceId: string, value: T) {
    emit('update:choice', { id: choiceId, value } as AnyUpdateChoice)
}

</script>

<template>
    <LabelTreeNodeComponent
        v-if="node.type === 'LabelTreeNode'"
        :node="(node as LabelTreeNode)">
    </LabelTreeNodeComponent>

    <BooleanSettingControl v-else-if="typeof choice.value === 'boolean'" :label="choice.label" :value="choice.value"
        @update:value="(value) => updateChoice(choice.id, value)" />

    <NumberSettingControl v-else-if="typeof choice.value === 'number'" :label="choice.label" :value="choice.value"
        :min="(choice as NumberSettingChoice).min" :max="(choice as NumberSettingChoice).max"
        :format="(choice as NumberSettingChoice).format"
        @update:value="(value) => updateChoice((choice as NumberSettingChoice).id, value)" />

    <StringSettingControl v-else-if="typeof choice.value === 'string'" :label="choice.label" :value="choice.value"
        :options="(choice as StringSettingChoice).options" :format="(choice as StringSettingChoice).format"
        @update:value="(value) => updateChoice(choice.id, value)" />
</template>
