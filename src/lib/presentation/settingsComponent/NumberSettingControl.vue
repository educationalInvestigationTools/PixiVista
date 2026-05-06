<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue';

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

const displayValue = computed(() => {
    if (props.format) {
        return props.format(props.value)
    }
    return props.value.toFixed(2)
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

onBeforeUnmount(() => {
    stopAdjust()
})
</script>

<template>
    <div class="setting-row">
        <span class="setting-label">{{ props.label }}</span>
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
            <span class="number-control__value">{{ displayValue }}</span>
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
    </div>
</template>

<style scoped>
.setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 6px 10px;
    background: var(--ui-panel-row-bg);
    border: 1px solid var(--ui-panel-border);
    box-sizing: border-box;
    height: 54px;
    width: max-content;
    font-family: var(--ui-font);
}

.setting-label {
    font-size: clamp(12px, 1.5vw, 14px);
    color: var(--ui-text-muted);
    text-transform: uppercase;
    letter-spacing: 1px;
    white-space: nowrap;
}

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

.number-control__value {
    min-width: 72px;
    text-align: center;
    font-size: clamp(12px, 1.5vw, 14px);
    color: var(--ui-text-primary);
}
</style>
