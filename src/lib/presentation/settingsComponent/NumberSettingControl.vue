<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue';
import SettingRow from '@/presentation/settingsComponent/SettingRow.vue';

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
    return Math.min(100, Math.max(0, raw))
})

const canDecrement = computed(() => props.value > props.min)
const canIncrement = computed(() => props.value < props.max)

const HOLD_DELAY_MS = 300
const HOLD_INTERVAL_MS = 60

let holdTimeout: ReturnType<typeof window.setTimeout> | null = null
let holdInterval: ReturnType<typeof window.setInterval> | null = null

function adjustValue(direction: number) {
    const step = stepSize.value
    if (step === 0) return

    const next = clamp(props.value + step * direction, props.min, props.max)
    const rounded = Math.round(next * 1000000) / 1000000

    if (rounded !== props.value) {
        emit('update:value', rounded)
    }
}

function canMove(direction: number) {
    return direction < 0 ? canDecrement.value : canIncrement.value
}

function stopAdjust() {
    if (holdTimeout !== null) {
        window.clearTimeout(holdTimeout)
        holdTimeout = null
    }

    if (holdInterval !== null) {
        window.clearInterval(holdInterval)
        holdInterval = null
    }
}

function startAdjust(direction: number) {
    if (!canMove(direction)) return

    stopAdjust()
    adjustValue(direction)

    holdTimeout = window.setTimeout(() => {
        holdInterval = window.setInterval(() => {
            if (!canMove(direction)) {
                stopAdjust()
                return
            }

            adjustValue(direction)
        }, HOLD_INTERVAL_MS)
    }, HOLD_DELAY_MS)
}

function handleClick(direction: number, event: MouseEvent) {
    if (event.detail !== 0) return
    adjustValue(direction)
}

function handleRangeInput(event: Event) {
    const target = event.target as HTMLInputElement | null
    if (!target) return
    const raw = Number(target.value)
    const next = clamp(raw, props.min, props.max)
    if (next !== props.value) {
        emit('update:value', next)
    }
}

onBeforeUnmount(() => {
    stopAdjust()
})
</script>

<template>
    <SettingRow :label="props.label">
        <div class="number-control">
            <button
                class="number-control__button"
                type="button"
                :disabled="!canDecrement"
                aria-label="Decrease value"
                @pointerdown="startAdjust(-1)"
                @pointerup="stopAdjust"
                @pointerleave="stopAdjust"
                @pointercancel="stopAdjust"
                @click="handleClick(-1, $event)">
                -
            </button>
            <div class="number-control__slider" :style="{ '--fill-percent': fillPercent + '%' }">
                <input
                    class="number-control__range"
                    type="range"
                    :min="props.min"
                    :max="props.max"
                    :step="inputStep"
                    :value="props.value"
                    @input="handleRangeInput" />
                <span class="number-control__value">{{ displayValue }}</span>
            </div>
            <button
                class="number-control__button"
                type="button"
                :disabled="!canIncrement"
                aria-label="Increase value"
                @pointerdown="startAdjust(1)"
                @pointerup="stopAdjust"
                @pointerleave="stopAdjust"
                @pointercancel="stopAdjust"
                @click="handleClick(1, $event)">
                +
            </button>
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

.number-control__button {
    width: 28px;
    height: 28px;
    border: 1px solid var(--ui-panel-border);
    background: var(--ui-panel-bg);
    color: var(--ui-text-primary);
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
}

.number-control__button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.number-control__button:focus-visible {
    outline: 1px solid var(--ui-focus-color);
    outline-offset: 1px;
}

.number-control__slider {
    position: relative;
    display: flex;
    align-items: center;
    min-width: 140px;
    height: 28px;
    padding: 0;
    background: linear-gradient(
        to right,
        var(--ui-panel-border) 0%,
        var(--ui-panel-border) var(--fill-percent),
        var(--ui-panel-bg) var(--fill-percent),
        var(--ui-panel-bg) 100%
    );
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

.number-control__range::-webkit-slider-runnable-track {
    height: 100%;
    background: transparent;
}

.number-control__range::-webkit-slider-thumb {
    appearance: none;
    width: 0;
    height: 0;
    border: none;
    background: transparent;
}

.number-control__range::-moz-range-track {
    height: 100%;
    background: transparent;
}

.number-control__range::-moz-range-thumb {
    width: 0;
    height: 0;
    border: none;
    background: transparent;
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
