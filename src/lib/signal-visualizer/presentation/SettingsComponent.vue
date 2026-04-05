<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import type { AnySettingChoice, AnySettingChoiceUpdate, NumberSettingChoice } from '@/lib/signal-visualizer/presentation/types/settingsChoice.ts';
import DialElement from './DialElement.vue';

const props = defineProps<{
    choices: AnySettingChoice[]
}>()

const emit = defineEmits<{
    (e: 'update:choice', update: AnySettingChoiceUpdate): void
}>()

function getChoiceInputId(choiceId: string) {
    return `setting-choice-${choiceId}`
}

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

function getStepPrecision(step?: number) {
    if (!step || step <= 0) {
        return 2
    }
    const stepString = `${step}`
    const dotIndex = stepString.indexOf('.')
    if (dotIndex === -1) {
        return 0
    }
    return stepString.length - dotIndex - 1
}

function formatNumberChoiceValue(choice: NumberSettingChoice, percent: number) {
    const value = getValueFromPercent(choice, percent)
    return value.toFixed(getStepPrecision(choice.step))
}

function updateNumberChoice(choice: NumberSettingChoice, percent: number) {
    emit('update:choice', {
        id: choice.id,
        value: getValueFromPercent(choice, percent)
    })
}

const showSettings = ref(true)
const settingsRootRef = ref<HTMLElement | null>(null)

function handleOutsidePointerDown(event: PointerEvent) {
    if (!showSettings.value) {
        return
    }

    const target = event.target as Node | null
    if (settingsRootRef.value && target && !settingsRootRef.value.contains(target)) {
        showSettings.value = false
    }
}

onMounted(() => {
    document.addEventListener('pointerdown', handleOutsidePointerDown)
})

onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handleOutsidePointerDown)
})

</script>

<template>
    <div ref="settingsRootRef" class="settings">
        <button class="settings__launcher" type="button" :aria-expanded="showSettings" aria-controls="settings-panel"
            :aria-label="showSettings ? 'Hide settings panel' : 'Show settings panel'"
            :title="showSettings ? 'Hide settings panel' : 'Show settings panel'"
            @click="(e) => { showSettings = !showSettings }">
            <span class="settings__launcher-icon" aria-hidden="true"></span>
            <span class="settings__launcher-text">Settings</span>
            <span class="settings__launcher-chevron" aria-hidden="true"></span>
        </button>

        <transition name="settings-panel">
            <div v-show="showSettings" id="settings-panel" class="settings__panel">
                <div v-for="choice in props.choices" :key="choice.id" class="settings__control"
                    :class="typeof choice.value === 'number' ? 'settings__control--number' : 'settings__control--boolean'">
                    <label class="settings__label" :for="getChoiceInputId(choice.id)">{{ choice.label }}</label>

                    <input v-if="typeof choice.value === 'boolean'" :id="getChoiceInputId(choice.id)"
                        class="settings__checkbox" type="checkbox" :checked="choice.value"
                        @change="updateBooleanChoice(choice.id, $event)">

                    <div v-else :id="getChoiceInputId(choice.id)" class="settings__number-value">
                        <DialElement :currentValuePercent="getNumberChoicePercent(choice as NumberSettingChoice)"
                            :toStringFromPercent="(percent) => formatNumberChoiceValue(choice as NumberSettingChoice, percent)"
                            @update:value="(percent) => updateNumberChoice(choice as NumberSettingChoice, percent)">
                        </DialElement>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.settings {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 10px;
    margin-bottom: 8px;
}

.settings__launcher {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
    padding: 7px 12px;
    border-radius: 999px;
    border: 1px solid #334155;
    background: linear-gradient(180deg, #020617 0%, #000000 100%);
    color: #dbeafe;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.45px;
    font-size: 12px;
    font-weight: 600;
    align-self: flex-start;
    transition: background-color 0.2s, border-color 0.2s, color 0.2s;
}

.settings__launcher:hover {
    background: #061020;
    border-color: #475569;
    color: #eff6ff;
}

.settings__launcher:focus-visible {
    outline: 2px solid #38bdf8;
    outline-offset: 2px;
}

.settings__launcher-icon {
    display: block;
    width: 14px;
    height: 14px;
    background-color: currentColor;
    -webkit-mask-image: url('../../../assets/icons/settings-gear.svg');
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    -webkit-mask-size: contain;
    mask-image: url('../../../assets/icons/settings-gear.svg');
    mask-repeat: no-repeat;
    mask-position: center;
    mask-size: contain;
}

.settings__launcher-text {
    display: block;
}

.settings__launcher-chevron {
    display: block;
    width: 10px;
    height: 10px;
    background-color: currentColor;
    -webkit-mask-image: url('../../../assets/icons/chevron-down.svg');
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    -webkit-mask-size: contain;
    mask-image: url('../../../assets/icons/chevron-down.svg');
    mask-repeat: no-repeat;
    mask-position: center;
    mask-size: contain;
    transition: transform 0.2s;
}

.settings__launcher[aria-expanded='true'] .settings__launcher-chevron {
    transform: rotate(180deg);
}

.settings__panel {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 8px 12px;
        padding: 5px;
    box-sizing: border-box;
    border-radius: 10px;
    border: 1px solid #334155;
    background: linear-gradient(180deg, #020617 0%, #01040c 100%);
    box-shadow: 0 8px 20px rgba(2, 6, 23, 0.45);
}

.settings__label {
    font-size: 12px;
    white-space: nowrap;
    letter-spacing: 0.2px;
    color: #cbd5e1;
}

.settings__control {
    display: inline-flex;
    flex: 0 0 auto;
    max-width: 100%;
    box-sizing: border-box;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    height: 42px;
    padding: 0 12px;
    border-radius: 999px;
    border: 1px solid #334155;
    background: rgba(15, 23, 42, 0.9);
}

.settings__number-value {
    height: 100%;
    display: flex;
    align-items: center;
}

.settings__checkbox {
    width: 100%;
        height: 100%;
    cursor: pointer;
    accent-color: #38bdf8;
}

.settings-panel-enter-active,
.settings-panel-leave-active {
    transition: opacity 0.18s ease, transform 0.18s ease;
    transform-origin: top left;
}

.settings-panel-enter-from,
.settings-panel-leave-to {
    opacity: 0;
    transform: translateY(-5px) scale(0.98);
}

@media (max-width: 700px) {
    .settings__panel {
        width: 100%;
    }
}
</style>
