<script setup lang="ts">

import type { PerformanceMetrics } from "@/lib/signal-visualizer/application/types.ts";
import { ref, watch } from "vue";


const props = defineProps<{
    metrics?: PerformanceMetrics
}>()

const renderTimeStack = ref<number[]>([])

watch(
    () => (props.metrics),
    () => {
        if (props.metrics != undefined) {
            const stack = renderTimeStack.value
            stack.push(props.metrics.renderTime)
            stack.sort((a, b) => (b - a))
            if (stack.length > 100) {
                renderTimeStack.value = stack.slice(0, 100)
            }

        }
    }
)

</script>

<template>
    <span> Last render times in ms: {{ renderTimeStack }} </span>
</template>

<style scoped></style>
