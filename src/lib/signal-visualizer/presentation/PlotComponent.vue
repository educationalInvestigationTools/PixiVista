<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {DIContainer} from "@/lib/signal-visualizer/application/DIContainer.ts";
import {ResizeDto} from "@/lib/signal-visualizer/application/Commands/ResizeCommand.ts";
import {type CompatibleSignal, ViewPort} from "@/lib/signal-visualizer/application/SignalSource.ts";
import {fmtTime} from "@/lib/signal-visualizer/utils/utils.ts";

const props = defineProps<{
    signalSources: CompatibleSignal[]
}>()


const htmlContainerRef = ref<HTMLDivElement | null>(null);
const resizeObserverRef = ref<ResizeObserver | null>(null)
let diContainer: DIContainer | null = null;

const maxSeconds = Math.max(...props.signalSources.map(signal => signal.totalSeconds))

let windowStartSeconds = ref(0)
let sliderPositionSeconds = ref(windowStartSeconds.value)
let windowLengthSeconds = ref(Math.min(10, maxSeconds))

let windowEndSeconds = computed(
    () => Math.max(windowStartSeconds.value, maxSeconds - windowLengthSeconds.value)
)

onMounted(async () => {
    if (!htmlContainerRef.value) {
        return;
    }
    const viewPort = new ViewPort(windowStartSeconds.value, windowLengthSeconds.value)
    diContainer = new DIContainer(htmlContainerRef.value, viewPort, props.signalSources);
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

async function onSliderChange() {
    await diContainer?.updateViewPortHandler.handle(
        sliderPositionSeconds.value
    )
}

</script>


<template>
    <div ref="htmlContainerRef" class="plot_container"></div>
    <div class="slider-wrap">
        <span class="slider-time-current"> {{ fmtTime(windowStartSeconds) }} </span>
        <input type='range'
               class="slider-time-range"
               :min="fmtTime(windowStartSeconds)"
               :max="windowEndSeconds"
               v-model.number="sliderPositionSeconds"
               step="1"
               @input = "onSliderChange"
        />
        <span class="slider-time-end"> {{ fmtTime(windowEndSeconds) }} </span>
        <span> {{ fmtTime(sliderPositionSeconds) }} </span>
    </div>
</template>

<style scoped>
.plot_container {
    width: 100%;
    height: 100%
}
</style>
