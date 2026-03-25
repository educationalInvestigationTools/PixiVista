<script setup lang="ts">

import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import {DiContainer} from "@/lib/signal-visualizer/application/diContainer.ts";
import {ResizeDto} from "@/lib/signal-visualizer/application/commands/resizeCommand.ts";
import {type SignalSource, ViewPort} from "@/lib/signal-visualizer/application/signalSource.ts";
import SliderComponent from "@/lib/signal-visualizer/presentation/SliderComponent.vue";
import SettingsComponent from "@/lib/signal-visualizer/presentation/SettingsComponent.vue";
import AnnotationsComponent from "@/lib/signal-visualizer/presentation/AnnotationsComponent.vue";
import MetricsComponent from "@/lib/signal-visualizer/presentation/MetricsComponent.vue"


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

const totalSeconds = Math.max(...props.signalSources.map(signal => signal.totalSeconds))
const windowStartSeconds = ref(0)
const windowLengthSeconds = ref(10)

const showMetricsPanel = ref(true)


onMounted(async () => {
    if (!htmlContainerRef.value) {
        return;
    }
    const viewPort = new ViewPort(windowStartSeconds.value, windowLengthSeconds.value)
    diContainer = new DiContainer(htmlContainerRef.value, viewPort, props.signalSources);
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
    await diContainer?.updateViewPortHandler.handle(currentPositionSeconds)
}

async function changeWindowLength(windowLength: number) {
    windowLengthSeconds.value = windowLength
}

async function changeViewPort() {
    await diContainer?.changeViewPortHandler.handle(windowStartSeconds.value, windowLengthSeconds.value)
}

async function toggleChannelVisibility(signalInfo: SignalVisibility) {
    signalsVisibility[signalInfo.label] = signalInfo
    await diContainer?.changeChannelVisibilityHandler.handle(signalInfo.label, signalInfo.visibility)
}

watch(
    () => windowLengthSeconds.value,
    () => changeViewPort()
)

</script>


<template>
    <SettingsComponent v-model:showMetrics="showMetricsPanel"
                       :windowLengthSeconds="windowLengthSeconds"
                       @updateWindowLength="changeWindowLength">
    </SettingsComponent>
    <AnnotationsComponent
        :signalsInfo="signalsVisibility"
        @toggleChannelVisibility="toggleChannelVisibility"></AnnotationsComponent>
    <div ref="htmlContainerRef" class="plot_container">
    </div>
    <SliderComponent :windowStartSeconds="windowStartSeconds"
                     :windowLengthSeconds="windowLengthSeconds"
                     :totalSeconds=totalSeconds @updateValue='updateViewPort'>
    </SliderComponent>
    <MetricsComponent v-show="showMetricsPanel"></MetricsComponent>

</template>

<style scoped>


</style>
