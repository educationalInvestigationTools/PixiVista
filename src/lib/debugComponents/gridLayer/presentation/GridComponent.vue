<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { DestroyCommand } from '@/application/commands/destroyCommand';
import { usePerformanceMetricsBridge } from '@/metricsComponent/presentation/utils/usePerformanceMetricsBridge';
import { useResizeObserver } from '@/presentation/utils/useResizeObserver';
import MetricsComponent from '@/metricsComponent/presentation/MetricsComponent.vue';
import { GridContainer } from '@/debugComponents/gridLayer/domain/gridContainer';

const htmlContainerRef = ref<HTMLDivElement | null>(null)

const {
    performanceMetricsRef,
    bindPerformanceMetrics,
} = usePerformanceMetricsBridge()
const {
    bindResizeObserver,
} = useResizeObserver()
let gridContainer: GridContainer | null = null


onMounted(async () => {
    if (!htmlContainerRef.value) {
        return
    }
    gridContainer = new GridContainer()
    await gridContainer.init(htmlContainerRef.value)

    const eventMediator = gridContainer.eventMediator
    bindResizeObserver(htmlContainerRef, eventMediator)
    bindPerformanceMetrics(eventMediator)
})

onBeforeUnmount(async () => {
    await gridContainer?.eventMediator.publish(new DestroyCommand())
})

</script>

<template>
    <div ref="htmlContainerRef" class="canvas__container"></div>
    <MetricsComponent :metrics="performanceMetricsRef"></MetricsComponent>
</template>


<style scoped>

.canvas__container {
    height : 200px;
}

</style>
