<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import MetricsComponent from './MetricsComponent.vue'
import type { PerformanceMetrics } from '@/lib/signal-visualizer/application/types/performanceMetrics.ts'

const metrics = ref<PerformanceMetrics | undefined>({
    renderTime: 5,
    refreshRate: 60,
    windowDevicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
    sizeData: { width: 800, height: 400 },
})

let intervalId: number | undefined

onMounted(() => {
    // simulate metric fluctuations so the component shows changing data
    intervalId = window.setInterval(() => {
        metrics.value = {
            renderTime: +(2 + Math.random() * 16).toFixed(2),
            refreshRate: Math.round(30 + Math.random() * 90),
            windowDevicePixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
            sizeData: {
                width: 640 + Math.round(Math.random() * 320),
                height: 240 + Math.round(Math.random() * 240),
            },
        }
    }, 1200)
})

onBeforeUnmount(() => {
    if (intervalId) window.clearInterval(intervalId)
})
</script>

<template>
    <MetricsComponent :metrics="metrics" />
</template>

<style scoped></style>
