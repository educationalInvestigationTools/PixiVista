<script setup lang="ts">
import { computed } from 'vue';
import SettingRow from '@/presentation/settingsComponent/SettingRow.vue';
import TouchableButton from '@/presentation/settingsComponent/Controls/NumberSettingControl/touchableButton/TouchableButton.vue';

const props = defineProps<{
    label: string
    value: number
    min: number
    max: number
    format?: (arg0: number) => string
}>()

const emit = defineEmits<{
    (e: 'update:value', value: number): void
}>()

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value))
}


const stepSize = computed(() => {
    const range = props.max - props.min
    if (range === 0) return 0
    const step = range / 100
    return step === 0 ? 1 : step
})

function adjustValue(direction: number) {

    const step = stepSize.value
    if (step === 0) return

    const value = props.value + step * direction
    const rounded = Math.round(value * 1000000) / 1000000
    const next = clamp(rounded, props.min, props.max)

    if (next !== props.value) {
        emit('update:value', next)
    }
}


const inputStep = computed(() => {
    const step = stepSize.value
    if (step === 0) return 1
    return step
})

const displayValue = computed(() => {
    if (props.format) {
        return props.format(props.value)
    }
    return props.value.toFixed(2)
})

const fillPercent = computed(() => {
    const range = props.max - props.min
    if (range === 0) return 0
    const raw = ((props.value - props.min) / range) * 100
    return clamp(raw, 0, 100)
})

function handleRangeInput(event: Event) {
    const target = event.target as HTMLInputElement | null
    if (!target) return
    const raw = Number(target.value)
    const next = clamp(raw, props.min, props.max)
    if (next !== props.value) {
        emit('update:value', next)
    }
}

</script>

<template>
    <SettingRow :label="props.label">
        <div class="number-control">
            <TouchableButton :isPositive="false" @buttonPressed="adjustValue"></TouchableButton>
            <div class="number-control__slider" :style="{ '--fill-percent': fillPercent + '%' }">
                <input class="number-control__range" type="range" :min="props.min" :max="props.max" :step="inputStep"
                    :value="props.value" @input="handleRangeInput" />
                <span class="number-control__value">{{ displayValue }}</span>
            </div>
            <TouchableButton :isPositive="true" @buttonPressed="adjustValue"></TouchableButton>
        </div>
    </SettingRow>
</template>

<style scoped>
.number-control {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px;
    background: var(--ui-panel-surface);
    border: 1px solid var(--ui-panel-border);
}

.number-control__slider {
    position: relative;
    display: flex;
    align-items: center;
    min-width: 140px;
    height: 28px;
    padding: 0;
    background: linear-gradient(to right,
            var(--ui-panel-border) 0%,
            var(--ui-panel-border) var(--fill-percent),
            var(--ui-panel-bg) var(--fill-percent),
            var(--ui-panel-bg) 100%);
    border: 1px solid var(--ui-panel-border);
    overflow: hidden;
}

.number-control__range {
    position: absolute;
    inset: 0;
    appearance: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
    margin: 0;
    opacity: 0;
}


.number-control__slider:focus-within {
    outline: 1px solid var(--ui-focus-color);
    outline-offset: 2px;
}

.number-control__value {
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
    font-size: clamp(11px, 1.4vw, 13px);
    color: var(--ui-text-primary);
    opacity: 0.6;
    pointer-events: none;
    text-shadow: 0 1px 0 var(--ui-panel-bg), 0 -1px 0 var(--ui-panel-bg);
}
</style>
