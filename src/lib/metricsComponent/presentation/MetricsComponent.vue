<script setup lang="ts">
import { ChangeThemeCommand } from '@/application/commands/changeThemeCommand';
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
        sizeInfo.value = `Resolution ${Math.round(props.metrics.sizeData.width)} x ${Math.round(props.metrics.sizeData.height)}, DPR ${props.metrics.resolution.toFixed(2)}`
    }

    window.addEventListener('themechanged', (event) => {
        const theme = (event as CustomEvent).detail.theme
        metricsContainer?.eventMediator.publish(new ChangeThemeCommand(theme))
    })
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

        sizeInfo.value = `Canvas Width =  ${Math.round(metricsValue.sizeData.width)}, Canvas Height = ${Math.round(metricsValue.sizeData.height)}, Resolution = ${metricsValue.resolution.toFixed(2)}`
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
    border: var(--ui-panel-border);
    background: var(--ui-panel-bg);
}

.metrics__header {
    color: var(--ui-text-primary);
    font-family: var(--ui-font-mono);
    font-size: 16px;
    letter-spacing: 0.5px;
}

.metrics__canvas {
    width: 100%;
    height: 280px;
}
</style>
