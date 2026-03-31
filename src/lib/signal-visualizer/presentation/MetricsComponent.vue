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

</script>

<template>
    <div class="flex flex-col border border-gray-900 rounded p-1">
        <span> Metrics panel:</span>
        <span> Rendering resolution is {{ Math.round(props.metrics?.sizeData.width!) }} x {{
            Math.round(props.metrics?.sizeData.height!)
            }} with a DPR={{ props.metrics?.windowDevicePixelRatio }}</span>
        <div>
            <span> Worst refresh rates per seconds are: </span>
            <span v-for="(rate, idx) in refreshRateStack" :key="idx" class="inline-block px-0.5"> {{ rate }}</span>
        </div>
        <div>
            <span> Worst render times in ms are: </span>
            <span v-for="(renderTime, idx) in renderTimeStack" :key="idx" class="inline-block px-0.5"> {{ renderTime
                }}</span>
        </div>
    </div>
</template>

<style scoped></style>
