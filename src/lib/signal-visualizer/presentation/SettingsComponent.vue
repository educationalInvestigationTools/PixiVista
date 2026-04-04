<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import type { AnySettingChoice, AnySettingChoiceUpdate, NumberSettingChoice } from '@/lib/signal-visualizer/presentation/types/settingsChoice.ts';


const props = defineProps<{
    choices: AnySettingChoice[]
}>()


const emit = defineEmits<{
    (e: 'update:choice', update: AnySettingChoiceUpdate): void
}>()

function toggleSettingsPanel() {
    showSettings.value = !showSettings.value
}

function getChoiceInputId(choiceId: string) {
    return `setting-choice-${choiceId}`
}

function updateBooleanChoice(choiceId: string, event: Event) {
    const target = event.target as HTMLInputElement
    emit('update:choice', { id: choiceId, value: target.checked })
}

function getStepPrecision(step: number) {
    const stepText = `${step}`
    const decimalSeparatorIndex = stepText.indexOf('.')
    if (decimalSeparatorIndex === -1) {
        return 0
    }

    return stepText.length - decimalSeparatorIndex - 1
}

function clampNumberChoiceValue(choice: NumberSettingChoice, value: number) {
    const boundedValue = Math.min(choice.max, Math.max(choice.min, value))
    const step = choice.step ?? 1

    if (step <= 0) {
        return boundedValue
    }

    const steppedValue = choice.min + Math.round((boundedValue - choice.min) / step) * step
    const precision = getStepPrecision(step)
    const clampedStepValue = Math.min(choice.max, Math.max(choice.min, steppedValue))
    return Number(clampedStepValue.toFixed(precision))
}

function valueToPercent(choice: NumberSettingChoice, value: number) {
    if (choice.max <= choice.min) {
        return 0
    }

    const ratio = (value - choice.min) / (choice.max - choice.min)
    return Math.min(100, Math.max(0, ratio * 100))
}

function percentToValue(choice: NumberSettingChoice, percent: number) {
    const clampedPercent = Math.min(100, Math.max(0, percent))
    const rawValue = choice.min + ((choice.max - choice.min) * clampedPercent) / 100
    return clampNumberChoiceValue(choice, rawValue)
}

function emitNumberChoiceValue(choice: NumberSettingChoice, value: number) {
    emit('update:choice', { id: choice.id, value: clampNumberChoiceValue(choice, value) })
}

type DialInteraction = {
    choice: NumberSettingChoice
    dialElement: HTMLElement
}

const activeDialInteraction = ref<DialInteraction | null>(null)

function getDialPercentFromPointer(event: PointerEvent, dialElement: HTMLElement) {
    const dialRect = dialElement.getBoundingClientRect()
    const centerX = dialRect.left + dialRect.width / 2
    const centerY = dialRect.top + dialRect.height / 2
    const deltaX = event.clientX - centerX
    const deltaY = event.clientY - centerY
    const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI
    const normalizedAngle = (angle + 450) % 360
    return (normalizedAngle / 360) * 100
}

function applyDialPointer(event: PointerEvent, interaction: DialInteraction) {
    const pointerPercent = getDialPercentFromPointer(event, interaction.dialElement)
    const nextValue = percentToValue(interaction.choice, pointerPercent)
    emitNumberChoiceValue(interaction.choice, nextValue)
}

function startDialInteraction(choice: NumberSettingChoice, event: PointerEvent) {
    event.preventDefault()
    const dialElement = event.currentTarget as HTMLElement
    const interaction = { choice, dialElement }
    activeDialInteraction.value = interaction
    applyDialPointer(event, interaction)
}

function handleDialPointerMove(event: PointerEvent) {
    if (!activeDialInteraction.value) {
        return
    }

    applyDialPointer(event, activeDialInteraction.value)
}

function stopDialInteraction() {
    activeDialInteraction.value = null
}

function nudgeNumberChoice(choice: NumberSettingChoice, direction: -1 | 1) {
    const step = choice.step ?? 1
    const nextValue = choice.value + step * direction
    emitNumberChoiceValue(choice, nextValue)
}

function getCapacityPercent(choice: NumberSettingChoice) {
    return Math.round(valueToPercent(choice, choice.value))
}

function getCapacityValue(choice: NumberSettingChoice) {
    const precision = getStepPrecision(choice.step ?? 1)
    return choice.value.toFixed(precision)
}

function getDialStyle(choice: NumberSettingChoice) {
    return {
        '--dial-fill': `${valueToPercent(choice, choice.value)}%`
    }
}

const showSettings = ref(false)
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
    window.addEventListener('pointermove', handleDialPointerMove)
    window.addEventListener('pointerup', stopDialInteraction)
    window.addEventListener('pointercancel', stopDialInteraction)
})

onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handleOutsidePointerDown)
    window.removeEventListener('pointermove', handleDialPointerMove)
    window.removeEventListener('pointerup', stopDialInteraction)
    window.removeEventListener('pointercancel', stopDialInteraction)
})

</script>

<template>
    <div ref="settingsRootRef" class="settings">
        <button class="settings__launcher" type="button" :aria-expanded="showSettings" aria-controls="settings-panel"
            :aria-label="showSettings ? 'Hide settings panel' : 'Show settings panel'"
            :title="showSettings ? 'Hide settings panel' : 'Show settings panel'" @click="toggleSettingsPanel">
            <span class="settings__launcher-icon" aria-hidden="true"></span>
            <span class="settings__launcher-text">Settings</span>
            <span class="settings__launcher-chevron" aria-hidden="true"></span>
        </button>

        <transition name="settings-panel">
            <div v-show="showSettings" id="settings-panel" class="settings__panel">
                <div v-for="choice in props.choices" :key="choice.id" class="settings__control"
                    :class="typeof choice.value === 'number' ? 'settings__control--number' : 'settings__control--boolean'">
                    <label class="settings__label" :for="getChoiceInputId(choice.id)">{{ choice.label }}</label>

                    <input v-if="typeof choice.value === 'boolean'" :id="getChoiceInputId(choice.id)" class="settings__checkbox"
                        type="checkbox" :checked="choice.value" @change="updateBooleanChoice(choice.id, $event)">

                    <div v-else class="settings__number-picker">
                        <button :id="getChoiceInputId(choice.id)" class="settings__dial" type="button" role="slider"
                            :aria-valuemin="choice.min" :aria-valuemax="choice.max" :aria-valuenow="choice.value"
                            :aria-label="`${choice.label} capacity`" :style="getDialStyle(choice)"
                            @pointerdown="startDialInteraction(choice, $event)"
                            @keydown.left.prevent="nudgeNumberChoice(choice, -1)"
                            @keydown.down.prevent="nudgeNumberChoice(choice, -1)"
                            @keydown.right.prevent="nudgeNumberChoice(choice, 1)"
                            @keydown.up.prevent="nudgeNumberChoice(choice, 1)">
                            <span class="settings__dial-inner" aria-hidden="true"></span>
                        </button>
                        <span class="settings__capacity" aria-live="polite">
                            <span class="settings__capacity-percent">{{ getCapacityPercent(choice) }}%</span>
                            <span class="settings__capacity-value">{{ getCapacityValue(choice) }}</span>
                        </span>
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
    gap: 10px 12px;
    padding: 12px;
    box-sizing: border-box;
    border-radius: 12px;
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

.settings__control--number {
    border-radius: 999px;
}

.settings__control--boolean {
    border-radius: 999px;
}

.settings__checkbox {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #38bdf8;
}

.settings__number-picker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.settings__dial {
    --dial-fill: 0%;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    padding: 0;
    border: 1px solid #475569;
    border-radius: 999px;
    cursor: pointer;
    user-select: none;
    touch-action: none;
    background:
        conic-gradient(#38bdf8 var(--dial-fill), rgba(56, 189, 248, 0.2) var(--dial-fill)),
        radial-gradient(circle at center, transparent 57%, rgba(15, 23, 42, 0.9) 58%);
    transition: border-color 0.2s, box-shadow 0.2s;
}

.settings__dial:hover {
    border-color: #7dd3fc;
}

.settings__dial:focus-visible {
    outline: 2px solid #38bdf8;
    outline-offset: 1px;
}

.settings__dial-inner {
    width: 16px;
    height: 16px;
    border-radius: 999px;
    border: 1px solid #334155;
    background: #0f172a;
}

.settings__capacity {
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
    white-space: nowrap;
}

.settings__capacity-percent {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.2px;
    color: #e2e8f0;
}

.settings__capacity-value {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.1px;
    color: #cbd5e1;
}

.settings__capacity-value::before {
    content: '\00B7';
    margin-right: 6px;
    color: #e2e8f0;
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
