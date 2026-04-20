<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { PerformanceMetrics } from '@/lib/signal-visualizer/core/types/performanceMetrics.ts'
import { MetricsContainer } from '@/lib/signal-visualizer/metricsComponent/core/metricsContainer.ts'
import { ResizeCommand } from '@/lib/signal-visualizer/application/commands/resizeCommand.ts'
import { DestroyCommand } from '@/lib/signal-visualizer/application/commands/destroyCommand.ts'
import {
    AppendPerformanceMetricsCommand,
} from '@/lib/signal-visualizer/metricsComponent/application/commands/appendPerformanceMetricsCommand.ts'
import {
    DEFAULT_ROLLING_WINDOW_MS,
} from '@/lib/signal-visualizer/metricsComponent/application/types/rollingWindowConfig.ts'
import {
    ChangeRollingWindowMsCommand,
} from '@/lib/signal-visualizer/metricsComponent/application/commands/changeRollingWindowMsCommand.ts'

const props = defineProps<{
    metrics?: PerformanceMetrics
    rollingWindowMs?: number
}>()

const htmlContainerRef = ref<HTMLDivElement | null>(null)
const resizeObserverRef = ref<ResizeObserver | null>(null)
let metricsContainer: MetricsContainer | null = null

const sizeInfo = ref('Waiting for metrics...')

onMounted(async () => {
    if (!htmlContainerRef.value) {
        return
    }

    metricsContainer = new MetricsContainer()
    await metricsContainer.init(
        htmlContainerRef.value,
        props.rollingWindowMs ?? DEFAULT_ROLLING_WINDOW_MS,
    )

    resizeObserverRef.value = new ResizeObserver(async () => {
        if (htmlContainerRef.value) {
            const width = htmlContainerRef.value.clientWidth
            const height = htmlContainerRef.value.clientHeight
            await metricsContainer?.eventMediator.publish(new ResizeCommand(width, height))
        }
    })
    resizeObserverRef.value.observe(htmlContainerRef.value)

    if (props.metrics) {
        await metricsContainer.eventMediator.publish(new AppendPerformanceMetricsCommand(props.metrics))
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
            new AppendPerformanceMetricsCommand(metricsValue),
        )

        sizeInfo.value = `Resolution ${Math.round(metricsValue.sizeData.width)} x ${Math.round(metricsValue.sizeData.height)}, DPR ${metricsValue.windowDevicePixelRatio.toFixed(2)}`
    },
)

watch(
    () => props.rollingWindowMs,
    async (rollingWindowMs) => {
        if (!metricsContainer || rollingWindowMs === undefined) {
            return
        }
        await metricsContainer.eventMediator.publish(
            new ChangeRollingWindowMsCommand(rollingWindowMs),
        )
    },
)

onBeforeUnmount(() => {
    resizeObserverRef.value?.disconnect()
})

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
