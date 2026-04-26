<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from 'vue';
import {LabelsContainer} from '../domain/labelsContainer';
import {ResizeCommand} from '@/lib/signal-visualizer/application/commands/resizeCommand';
import type {PerformanceMetrics} from '@/lib/signal-visualizer/core/types/performanceMetrics';
import {
    GetPerformanceMetricsEventLabel,
    type GetPerformanceMetrics
} from '@/lib/signal-visualizer/application/querys/getPerformanceMetrics';
import MetricsComponent
    from '@/lib/signal-visualizer/metricsComponent/presentation/MetricsComponent.vue';
import type {PositionData} from '@/lib/signal-visualizer/core/types/positionData';
import {DestroyCommand} from '@/lib/signal-visualizer/application/commands/destroyCommand';
import {generateRandomString} from '../utils/utils';
import {
    ChangeCellTextCommand
} from "@/lib/signal-visualizer/debugComponents/labelsLayer/application/commands/changeCellTextCommand.ts";
import {
    ChangeAllCellsTextCommand
} from "@/lib/signal-visualizer/debugComponents/labelsLayer/application/commands/changeAllCellsTextCommand.ts";


const htmlContainerRef = ref<HTMLDivElement | null>(null)
const resizeObserverRef = ref<ResizeObserver | null>(null)
const performanceMetricsRef = ref<PerformanceMetrics | undefined>(undefined)
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


    resizeObserverRef.value = new ResizeObserver(async () => {
        if (htmlContainerRef.value) {
            const width = htmlContainerRef.value.clientWidth
            const height = htmlContainerRef.value.clientHeight
            await labelsContainer?.eventMediator.publish(new ResizeCommand(width, height))
        }
    })
    resizeObserverRef.value.observe(htmlContainerRef.value)

    labelsContainer.eventMediator.addHandler<GetPerformanceMetrics>(GetPerformanceMetricsEventLabel, (metrics: GetPerformanceMetrics) => {
        performanceMetricsRef.value = metrics.performanceMetrics;
        return Promise.resolve()
    })

    htmlContainerRef.value.addEventListener('pointerdown', handlePointerDown)

    setInterval(() => {
        if (toggleAllText.value) {
            toggleChangeAllStrings()
        }
    }, 200)

})

onBeforeUnmount(() => {
    resizeObserverRef.value?.disconnect()
    htmlContainerRef.value?.removeEventListener('pointerdown', handlePointerDown)
})

onBeforeUnmount(async () => {
    await labelsContainer?.eventMediator.publish(new DestroyCommand())
})


</script>

<template>
    <input type="checkbox" :checked="toggleAllText" @change="(event) => {
    const target = event.target as HTMLInputElement
    toggleAllText =  target.checked}">
    <div ref="htmlContainerRef" class="canvas__container"></div>
    <MetricsComponent :metrics="performanceMetricsRef"></MetricsComponent>

</template>

<style scoped>
.canvas__container {
    height: 300px;
}
</style>
