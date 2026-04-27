<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { DestroyCommand } from '@/lib/signal-visualizer/application/commands/destroyCommand';
import { usePerformanceMetricsBridge } from '@/lib/signal-visualizer/presentation/utils/usePerformanceMetricsBridge';
import { useResizeObserver } from '@/lib/signal-visualizer/presentation/utils/useResizeObserver';

import MetricsComponent from '@/lib/signal-visualizer/metricsComponent/presentation/MetricsComponent.vue';
import { LineLabelsContainer } from '../domain/lineLabelsContainer';

const htmlContainerRef = ref<HTMLDivElement | null>(null)

const {
    performanceMetricsRef,
    bindPerformanceMetrics,
} = usePerformanceMetricsBridge()
const {
    bindResizeObserver,
} = useResizeObserver()
let lineLabelContainer: LineLabelsContainer | null = null


onMounted(async () => {
    if (!htmlContainerRef.value) {
        return
    }
    lineLabelContainer = new LineLabelsContainer()
    await lineLabelContainer.init(htmlContainerRef.value)

    const eventMediator = lineLabelContainer.eventMediator
    bindResizeObserver(htmlContainerRef, eventMediator)
    bindPerformanceMetrics(eventMediator)
})

onBeforeUnmount(async () => {
    await lineLabelContainer?.eventMediator.publish(new DestroyCommand())
})

</script>

<template>
    <div ref="htmlContainerRef" class="canvas__container"></div>
    <MetricsComponent :metrics="performanceMetricsRef"></MetricsComponent>
</template>


<style scoped>

.canvas__container {
    height : 100px;
}

</style>
