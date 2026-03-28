<script setup lang="ts">

import {onBeforeUnmount, onMounted, ref} from "vue";
import {DiContainer} from "@/lib/signal-visualizer/application/diContainer.ts";
import {ResizeDto} from "@/lib/signal-visualizer/application/commands/resizeCommand.ts";
import {type SignalSource, ViewPort} from "@/lib/signal-visualizer/application/signalSource.ts";
import SliderComponent from "@/lib/signal-visualizer/presentation/SliderComponent.vue";
import SettingsComponent from "@/lib/signal-visualizer/presentation/SettingsComponent.vue";
import AnnotationsComponent from "@/lib/signal-visualizer/presentation/AnnotationsComponent.vue";
import MetricsComponent from "@/lib/signal-visualizer/presentation/MetricsComponent.vue"
import type {PerformanceMetrics} from "@/lib/signal-visualizer/application/types.ts";
import {EventMediator} from "@/lib/signal-visualizer/utils/eventMediator.ts";


const props = defineProps<{
    signalSources: SignalSource[]
}>()

export type SignalVisibility = {
    label: string
    visibility: boolean
}

const signalsVisibility: Record<string, SignalVisibility> = props.signalSources.reduce<Record<string, SignalVisibility>>((acc, signal) => {
    acc[signal.label] = {
        label: signal.label,
        visibility: true
    }
    return acc
}, {})

const htmlContainerRef = ref<HTMLDivElement | null>(null);
const resizeObserverRef = ref<ResizeObserver | null>(null)
let diContainer: DiContainer | null = null;

const signalsLargestDurationSeconds = Math.max(...props.signalSources.map(signal => signal.totalSeconds))
const viewPortStartSeconds = ref(0)
const windowLengthSeconds = ref(10)

const performanceMetrics = ref<PerformanceMetrics | undefined>(undefined)

const showMetricsPanel = ref(true)
const showAnnotationsPanel = ref(true)


onMounted(async () => {
    if (!htmlContainerRef.value) {
        return;
    }
    const viewPort = new ViewPort(viewPortStartSeconds.value, windowLengthSeconds.value)
    const eventMediator = new EventMediator((metrics: PerformanceMetrics) => performanceMetrics.value = metrics)
    diContainer = new DiContainer(htmlContainerRef.value, viewPort, props.signalSources, eventMediator);
    await diContainer.init()

    resizeObserverRef.value = new ResizeObserver(async () => {
        if (htmlContainerRef.value) {
            const width = htmlContainerRef.value.clientWidth;
            const height = htmlContainerRef.value.clientHeight;
            await diContainer?.resizeHandler.handle(new ResizeDto(width, height));
        }
    })
    resizeObserverRef.value.observe(htmlContainerRef.value);
})

onBeforeUnmount(() => resizeObserverRef.value!.disconnect())

onBeforeUnmount(async () => {
    diContainer?.destroyHandler.handle()
})

async function updateViewPort(currentPositionSeconds: number) {
    viewPortStartSeconds.value = currentPositionSeconds
    await diContainer?.updateViewPortHandler.handle(viewPortStartSeconds.value)
}

async function updateWindowLength(windowLength: number) {
    windowLengthSeconds.value = windowLength
    await diContainer?.changeViewPortHandler.handle(viewPortStartSeconds.value, windowLength)
}

async function toggleChannelVisibility(signalInfo: SignalVisibility) {
    signalsVisibility[signalInfo.label] = signalInfo
    await diContainer?.changeChannelVisibilityHandler.handle(signalInfo.label, signalInfo.visibility)
}

</script>


<template>
    <div class="m-4 border border-gray-900 rounded p-2">
        <SettingsComponent v-model:showAnnotations="showAnnotationsPanel"
                           v-model:showMetrics="showMetricsPanel"
                           :windowLengthSeconds="windowLengthSeconds"
                           @updateWindowLength="updateWindowLength">
        </SettingsComponent>
        <AnnotationsComponent v-show="showAnnotationsPanel" :signalsInfo="signalsVisibility"
                              @toggleChannelVisibility="toggleChannelVisibility">
        </AnnotationsComponent>
        <div class="border border-gray-900 rounded p-2">
            <div ref="htmlContainerRef" class="plot_container">
            </div>
        </div>
        <SliderComponent :leftSliderPosition="15" :rightSliderPosition="5"
                         :viewPortStartSeconds="viewPortStartSeconds"
                         :windowLengthSeconds="windowLengthSeconds"
                         :signalsLargestDuration=signalsLargestDurationSeconds
                         @update:viewPortStartSeconds='updateViewPort'
                         @update:windowLengthSeconds="updateWindowLength">
        </SliderComponent>
        <MetricsComponent :metrics="performanceMetrics"
                          v-show="showMetricsPanel"></MetricsComponent>
    </div>

</template>

<style scoped></style>
