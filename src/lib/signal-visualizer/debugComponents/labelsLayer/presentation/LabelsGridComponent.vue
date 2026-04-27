<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { LabelsContainer } from '../domain/labelsContainer';
import MetricsComponent
    from '@/lib/signal-visualizer/metricsComponent/presentation/MetricsComponent.vue';
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData';
import { DestroyCommand } from '@/lib/signal-visualizer/application/commands/destroyCommand';
import { generateRandomString } from '../utils/utils';
import {
    ChangeCellTextCommand
} from "@/lib/signal-visualizer/debugComponents/labelsLayer/application/commands/changeCellTextCommand.ts";
import {
    ChangeAllCellsTextCommand
} from "@/lib/signal-visualizer/debugComponents/labelsLayer/application/commands/changeAllCellsTextCommand.ts";
import { useResizeObserver } from '@/lib/signal-visualizer/presentation/utils/useResizeObserver';
import { usePerformanceMetricsBridge } from '@/lib/signal-visualizer/presentation/utils/usePerformanceMetricsBridge';


const htmlContainerRef = ref<HTMLDivElement | null>(null)

const {
    performanceMetricsRef,
    bindPerformanceMetrics,
} = usePerformanceMetricsBridge()
const {
    bindResizeObserver,
} = useResizeObserver()
let labelsContainer: LabelsContainer | null = null

const toggleAllText = ref<boolean>(false)


function toggleChangeStringOnCell(posData: PositionData) {
    const randomString = generateRandomString(100, 200)
    labelsContainer?.eventMediator.publish(new ChangeCellTextCommand(randomString, posData))
}

function toggleChangeAllStrings() {
    labelsContainer?.eventMediator.publish(new ChangeAllCellsTextCommand())
}

function handlePointerDown(event: PointerEvent) {
    const canvas = htmlContainerRef.value
    if (!canvas) {
        return
    }

    const rect = canvas.getBoundingClientRect()
    const positionData: PositionData = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    }

    toggleChangeStringOnCell(positionData)
}

onMounted(async () => {
    if (!htmlContainerRef.value) {
        return
    }
    labelsContainer = new LabelsContainer()
    await labelsContainer.init(
        htmlContainerRef.value,
    )
    const eventMediator = labelsContainer.eventMediator
    bindResizeObserver(htmlContainerRef, eventMediator)
    bindPerformanceMetrics(eventMediator)

    htmlContainerRef.value.addEventListener('pointerdown', handlePointerDown)

    setInterval(() => {
        if (toggleAllText.value) {
            toggleChangeAllStrings()
        }
    }, 200)

})

onBeforeUnmount(() => {
    htmlContainerRef.value?.removeEventListener('pointerdown', handlePointerDown)
})

onBeforeUnmount(async () => {
    await labelsContainer?.eventMediator.publish(new DestroyCommand())
})


</script>

<template>
    <input type="checkbox" :checked="toggleAllText" @change="(event) => {
        const target = event.target as HTMLInputElement
        toggleAllText = target.checked
    }">
    <div ref="htmlContainerRef" class="canvas__container"></div>
    <MetricsComponent :metrics="performanceMetricsRef"></MetricsComponent>

</template>

<style scoped>
.canvas__container {
    height: 600px;
}
</style>
