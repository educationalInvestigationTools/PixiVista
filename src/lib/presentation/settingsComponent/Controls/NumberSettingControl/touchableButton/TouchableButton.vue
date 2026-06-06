<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    isPositive: boolean
}>()

const emit = defineEmits<{
    (e: 'buttonPressed', value: number): void
}>()

const direction = computed(() => props.isPositive ? 1 : -1)

function handleClick(direction: number, event: MouseEvent) {
    if (event.detail !== 0) return
    emit('buttonPressed', direction)
}

const HOLD_DELAY_MS = 300
const HOLD_INTERVAL_MS = 60

let holdTimeout: ReturnType<typeof window.setTimeout> | null = null
let holdInterval: ReturnType<typeof window.setInterval> | null = null

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
    stopAdjust()
    emit('buttonPressed', direction)

    holdTimeout = window.setTimeout(() => {
        holdInterval = window.setInterval(() => {
            emit('buttonPressed', direction)
        }, HOLD_INTERVAL_MS)
    }, HOLD_DELAY_MS)
}

</script>

<template>

    <button class="number-control__button" type="button" aria-label="Decrease value" @pointerdown="startAdjust(direction)"
        @pointerup="stopAdjust" @pointerleave="stopAdjust" @pointercancel="stopAdjust" @click="handleClick(-1, $event)">
        {{ props.isPositive ? '+' : '-' }}
    </button>

</template>

<style scoped>
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
</style>
