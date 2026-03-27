<script setup lang="ts">

import type { PerformanceMetrics } from "@/lib/signal-visualizer/application/types.ts";
import { ref, watch } from "vue";


const props = defineProps<{
    metrics?: PerformanceMetrics
}>()

const renderTimeStack = ref<number[]>([])
const refreshRateStack = ref<number[]>([])

watch(
    () => (props.metrics),
    () => {
        if (props.metrics != undefined) {
            renderTimeStack.value.push(props.metrics.renderTime)
            renderTimeStack.value.sort((a, b) => (b - a))
            if (renderTimeStack.value.length > 100) {
                renderTimeStack.value = renderTimeStack.value.slice(0, 100)
            }

            refreshRateStack.value.push(Math.round(props.metrics.refreshRate))
            refreshRateStack.value.sort((a, b) => (a - b))
            if (refreshRateStack.value.length > 100) {
                refreshRateStack.value = refreshRateStack.value.slice(0, 100)
            }


        }

    }
)

function refreshRateColor(value: number): string {
    const green = { r: 34, g: 197, b: 94 };  // #22c55e
    const red = { r: 239, g: 68, b: 68 };  // #ef4444
    const t = Math.min(1, Math.max(0, value / 60));
    const r = Math.round(red.r + t * (green.r - red.r));
    const g = Math.round(red.g + t * (green.g - red.g));
    const b = Math.round(red.b + t * (green.b - red.b));
    return `rgb(${r}, ${g}, ${b})`;
}

function renderTimeColor(value: number): string {
    const max = 1000 / 30; // 33.33...
    const t = Math.min(1, Math.max(0, value / max));
    // t_good = 1 - t because lower is better
    const t_good = 1 - t;
    const green = { r: 34, g: 197, b: 94 };
    const red = { r: 239, g: 68, b: 68 };
    const r = Math.round(red.r + t_good * (green.r - red.r));
    const g = Math.round(red.g + t_good * (green.g - red.g));
    const b = Math.round(red.b + t_good * (green.b - red.b));
    return `rgb(${r}, ${g}, ${b})`;
}


</script>

<template>
    <div class="flex flex-col border border-gray-900 rounded p-1">
        <span> Metrics panel:</span>
        <span> Rendering resolution is {{ props.metrics?.sizeData.width }} x {{ props.metrics?.sizeData.height
            }}</span>
        <div>
            <span> Worst refresh rates per seconds are: </span>
            <span v-for="(rate, idx) in refreshRateStack" :key="idx" class="inline-block px-0.5"
                :style="{ color: refreshRateColor(rate) }"> {{ rate }}</span>
        </div>
        <div>
            <span> Worst render times in ms are: </span>
            <span v-for="(renderTime, idx) in renderTimeStack" :key="idx" class="inline-block px-0.5"
                :style="{ color: renderTimeColor(renderTime) }"> {{ renderTime }}</span>
        </div>
    </div>
</template>

<style scoped></style>
