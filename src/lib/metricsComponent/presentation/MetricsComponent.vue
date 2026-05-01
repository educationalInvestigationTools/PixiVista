<script setup lang="ts">
import { DestroyCommand } from '@/application/commands/destroyCommand';
import type { PerformanceMetrics } from '@/core/types/performanceMetrics';
import { AddPerformanceMetricsCommand } from '@/metricsComponent/application/commands/addPerformanceMetricsCommand';
import { MetricsContainer } from '@/metricsComponent/domain/metricsContainer';
import { useResizeObserver } from '@/presentation/utils/useResizeObserver';
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';



const props = defineProps<{
    metrics?: PerformanceMetrics
}>()

const htmlContainerRef = ref<HTMLDivElement | null>(null)
let metricsContainer: MetricsContainer | null = null
const {
    bindResizeObserver,
} = useResizeObserver()

const sizeInfo = ref('Waiting for metrics...')

onMounted(async () => {
    if (!htmlContainerRef.value) {
        return
    }

    metricsContainer = new MetricsContainer()
    await metricsContainer.init(
        htmlContainerRef.value,
    )

    bindResizeObserver(htmlContainerRef, metricsContainer.eventMediator)

    if (props.metrics) {
        await metricsContainer.eventMediator.publish(new AddPerformanceMetricsCommand(props.metrics))
        sizeInfo.value = `Resolution ${Math.round(props.metrics.sizeData.width)} x ${Math.round(props.metrics.sizeData.height)}, DPR ${props.metrics.windowDevicePixelRatio.toFixed(2)}`
    }
})

watch(
    () => props.metrics,
    async (metricsValue) => {
        if (!metricsValue || !metricsContainer) {
            return
        }

        await metricsContainer.eventMediator.publish(
            new AddPerformanceMetricsCommand(metricsValue),
        )

        sizeInfo.value = `Resolution ${Math.round(metricsValue.sizeData.width)} x ${Math.round(metricsValue.sizeData.height)}, DPR ${metricsValue.windowDevicePixelRatio.toFixed(2)}`
    },
)



onBeforeUnmount(async () => {
    if (!metricsContainer) {
        return
    }
    await metricsContainer.eventMediator.publish(new DestroyCommand())
    metricsContainer = null
})
</script>

<template>
    <div class="metrics__shell">
        <div class="metrics__header">{{ sizeInfo }}</div>
        <div ref="htmlContainerRef" class="metrics__canvas"></div>
    </div>
</template>

<style scoped>
.metrics__shell {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px;
    border: 1px solid #1f2937;
    background: linear-gradient(140deg, #030712, #0b1220 40%, #0f172a);
}

.metrics__header {
    color: #cbd5e1;
    font-family: 'JetBrains Mono', Menlo, monospace;
    font-size: 12px;
    letter-spacing: 0.02em;
}

.metrics__canvas {
    width: 100%;
    height: 280px;
}
</style>
