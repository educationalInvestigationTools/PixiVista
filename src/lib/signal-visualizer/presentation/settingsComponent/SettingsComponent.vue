<script setup lang="ts">
import { ref } from 'vue';
import type { AnySettingChoice, AnySettingChoiceUpdate, NumberSettingChoice } from '@/lib/signal-visualizer/presentation/settingsComponent/settingsChoice';
import settingsGearIcon from '@/assets/icons/settings-gear.svg';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';

import DialElement from '../dialElement/DialElement.vue';

const props = defineProps<{
    choices: AnySettingChoice[]
}>()

const emit = defineEmits<{
    (e: 'update:choice', update: AnySettingChoiceUpdate): void
}>()

function updateBooleanChoice(choiceId: string, event: Event) {
    const target = event.target as HTMLInputElement
    emit('update:choice', { id: choiceId, value: target.checked })
}

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value))
}

function getNumberChoicePercent(choice: NumberSettingChoice) {
    const range = choice.max - choice.min
    if (range <= 0) {
        return 0
    }
    const percent = ((choice.value - choice.min) / range) * 100
    return clamp(percent, 0, 100)
}

function getValueFromPercent(choice: NumberSettingChoice, percent: number) {
    const normalizedPercent = clamp(percent, 0, 100)
    const range = choice.max - choice.min

    if (range <= 0) {
        return choice.min
    }

    const rawValue = choice.min + (normalizedPercent / 100) * range
    if (choice.step && choice.step > 0) {
        const stepped = choice.min + Math.round((rawValue - choice.min) / choice.step) * choice.step
        return clamp(stepped, choice.min, choice.max)
    }

    return clamp(rawValue, choice.min, choice.max)
}


function updateNumberChoice(choice: NumberSettingChoice, percent: number) {
    emit('update:choice', {
        id: choice.id,
        value: getValueFromPercent(choice, percent)
    })
}

function formatNumberChoiceValue(choice: NumberSettingChoice, percent: number) {
    return choice.toString(getValueFromPercent(choice, percent))
}

const showSettings = ref(true)

</script>

<template>
    <div class="settings">
        <button class="settings__launcher" type="button"
            :title="showSettings ? 'Hide settings panel' : 'Show settings panel'"
            @click="(e) => { showSettings = !showSettings }">
            <img class="settings__launcher--icon" :src="settingsGearIcon">
            <span class="settings__launcher--text">Settings</span>
            <img v-if="!showSettings" class="settings__launcher--chevron" :src="chevronDownIcon">
            <img v-else class="settings__launcher--chevron" :src="chevronDownIcon">
        </button>
        <div v-show="showSettings" class="settings__panel">
            <div v-for="choice in props.choices" :key="choice.id" class="settings__element">
                <label class="settings__element--label">{{ choice.label }}</label>

                <input v-if="typeof choice.value === 'boolean'" class="settings__checkbox" type="checkbox"
                    :checked="choice.value" @change="updateBooleanChoice(choice.id, $event)">

                <DialElement v-else-if="typeof choice.value === 'number'" class="settings__dial"
                    :currentValuePercent="getNumberChoicePercent(choice as NumberSettingChoice)"
                    :toStringFromPercent="(percent) => formatNumberChoiceValue(choice as NumberSettingChoice, percent)"
                    @update:value="(percent) => updateNumberChoice(choice as NumberSettingChoice, percent)">
                </DialElement>
            </div>
        </div>
    </div>
</template>

<style scoped>
.settings {
    box-sizing: border-box;
        padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: black;
}

.settings__launcher {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    padding: 1px 10px;
    border-radius: 10px;
    border: 1px solid #334155;
    color: #dbeafe;
    cursor: pointer;
    letter-spacing: 1px;
    font-size: 14px;
    font-weight: 600;
    align-self: center;
    background-color: black;
}

.settings__launcher--icon {
    filter: brightness(0) saturate(100%) invert(27%) sepia(100%);
    width: 40px;
    height: 40px;
}

.settings__launcher--text {
    font-size: 20px;
}


.settings__launcher--chevron {
    filter: brightness(0) saturate(100%) invert(27%) sepia(100%);
    width: 40px;
    height: 40px;
}

.settings__panel {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 12px;
    padding: 5px;
    border-radius: 10px;
    border: 1px solid #334155;
}

.settings__element--label {
    font-size: 16px;
    letter-spacing: 0.2px;
    color: #cbd5e1;
}

.settings__element {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    padding: 0 12px;
    border-radius: 10px;
    border: 1px solid #334155;
    background: rgba(15, 23, 42, 0.9);
}

.settings__checkbox {
    width: 100%;
    height: 100%;
    cursor: pointer;
    border-radius: 3px;
}
</style>
