<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {DiContainer} from "@/lib/signal-visualizer/application/diContainer.ts";
import {ResizeDto} from "@/lib/signal-visualizer/application/commands/resizeCommand.ts";
import {type SignalSource} from "@/lib/signal-visualizer/application/types/signalSource.ts";
import SliderComponent from "@/lib/signal-visualizer/presentation/SliderComponent.vue";
import SettingsComponent from "@/lib/signal-visualizer/presentation/SettingsComponent.vue";
import AnnotationsComponent from "@/lib/signal-visualizer/presentation/AnnotationsComponent.vue";
import MetricsComponent from "@/lib/signal-visualizer/presentation/MetricsComponent.vue"
import type {
    PerformanceMetrics
} from "@/lib/signal-visualizer/application/types/performanceMetrics.ts";
import {EventMediator} from "@/lib/signal-visualizer/utils/eventMediator.ts";
import {fmtTime} from "../utils/utils";
import {ViewPort} from "@/lib/signal-visualizer/application/types/viewPort.ts";


const props = defineProps<{
    signalSources: SignalSource[]
}>()

export type ChannelVisibility = {
    label: string
    visibility: boolean
}

const channelVisibility = ref(props.signalSources.reduce<Record<string, ChannelVisibility>>((acc, signal) => {
    acc[signal.label] = {
        label: signal.label,
        visibility: true
    }
    return acc
}, {}))

async function toggleChannelVisibility(signalInfo: ChannelVisibility) {
    channelVisibility.value[signalInfo.label] = signalInfo
    await diContainer?.changeChannelVisibilityHandler.handle(signalInfo.label, signalInfo.visibility)
}

const heightPerChannel = ref(200)

const visibleChannels = computed(() => {
    let visible = 0
    for (const label of Object.keys(channelVisibility.value)) {
        if (channelVisibility.value[label]!.visibility) {
            visible++
        }
    }
    return visible
})


const htmlContainerRef = ref<HTMLDivElement | null>(null);
const resizeObserverRef = ref<ResizeObserver | null>(null)
let diContainer: DiContainer | null = null;

const signalsLargestDurationSeconds = Math.max(...props.signalSources.map(signal => signal.totalSeconds))
const viewPortRef = ref(new ViewPort(0, 10))

const performanceMetrics = ref<PerformanceMetrics | undefined>(undefined)

const showMetricsPanel = ref(true)
const showAnnotationsPanel = ref(true)


onMounted(async () => {
    if (!htmlContainerRef.value) {
        return;
    }
    const viewPort = viewPortRef.value
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


async function updateViewPort(viewPort: ViewPort) {
    viewPortRef.value = viewPort
    await diContainer?.changeViewPortHandler.handle(viewPortRef.value)
}

</script>


<template>
    <div class="m-4 border border-gray-900 rounded p-2">
        <SettingsComponent v-model:showAnnotations="showAnnotationsPanel"
                           v-model:showMetrics="showMetricsPanel"
                           v-model:heightPerChannel="heightPerChannel">
        </SettingsComponent>
        <AnnotationsComponent v-show="showAnnotationsPanel" :signalsInfo="channelVisibility"
                              @toggleChannelVisibility="toggleChannelVisibility">
        </AnnotationsComponent>
        <div class="border border-gray-900 rounded p-2">
            <div ref="htmlContainerRef" :style="{
                height: heightPerChannel * (visibleChannels + 1) + 'px'
            }">
            </div>
        </div>
        <SliderComponent :sampleToString="fmtTime" :leftSliderPositionPercent="15"
                         :rightSliderPositionPercent="5"
                         :viewPort="viewPortRef"
                         :viewPortLargestValueSamples=signalsLargestDurationSeconds
                         @update:viewPort='updateViewPort'>
        </SliderComponent>
        <MetricsComponent :metrics="performanceMetrics"
                          v-show="showMetricsPanel"></MetricsComponent>
    </div>

</template>

<style scoped></style>
