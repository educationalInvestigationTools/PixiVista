<script setup lang="ts">
import { DestroyCommand } from '@/application/commands/destroyCommand'
import type { Point2D } from '@/core/types/point2D'
import { ChangeAllCellsTextCommand } from '@/debugComponents/labelsLayer/application/commands/changeAllCellsTextCommand'
import { ChangeCellTextCommand } from '@/debugComponents/labelsLayer/application/commands/changeCellTextCommand'
import { LabelsContainer } from '@/debugComponents/labelsLayer/domain/labelsContainer'
import { generateRandomString } from '@/debugComponents/labelsLayer/utils/utils'
import { usePerformanceMetricsBridge } from '@/metricsComponent/presentation/utils/usePerformanceMetricsBridge'
import { useResizeObserver } from '@/presentation/utils/useResizeObserver'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import MetricsComponent from '@/metricsComponent/presentation/MetricsComponent.vue';




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


function toggleChangeStringOnCell(posData: Point2D) {
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
    const positionData: Point2D = {
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
