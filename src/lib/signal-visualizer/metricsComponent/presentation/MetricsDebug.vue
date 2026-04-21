<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import MetricsComponent from './MetricsComponent.vue'
import type {
    PerformanceMetrics
} from '@/lib/signal-visualizer/core/types/performanceMetrics.ts'

const metrics = ref<PerformanceMetrics | undefined>({
    renderTime: 5,
    refreshRate: 60,
    windowDevicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
    sizeData: { width: 800, height: 400 },
    date : new Date()
})

let timeoutId: number | undefined
const startTimestamp = Date.now()

function nextDelayMs() {
    return 50 + Math.round(Math.random() * 350)
}

function emitSample() {
    const elapsedSeconds = (Date.now() - startTimestamp) / 1000
    const smoothWave = Math.sin(elapsedSeconds * 3.2)
    const burstWave = Math.max(0, Math.sin(elapsedSeconds * 8.8))
    const randomNoise = Math.random() * 3

    const refreshRate = Math.max(20, Math.min(144, 58 + smoothWave * 24 + randomNoise * 2))
    const renderTime = Math.max(1.5, 5 + burstWave * 14 + Math.random() * 2.5)

    metrics.value = {
        renderTime: Number(renderTime.toFixed(2)),
        refreshRate: Number(refreshRate.toFixed(2)),
        windowDevicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
        sizeData: {
            width: 680 + Math.round(Math.sin(elapsedSeconds) * 30),
            height: 280,
        },
        date : new Date()
    }

    timeoutId = window.setTimeout(emitSample, nextDelayMs())
}

onMounted(() => {
    timeoutId = window.setTimeout(emitSample, nextDelayMs())
})

onBeforeUnmount(() => {
    if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId)
    }
})
</script>

<template>
    <MetricsComponent :metrics="metrics" :rolling-window-ms="1000" />
</template>

<style scoped></style>
