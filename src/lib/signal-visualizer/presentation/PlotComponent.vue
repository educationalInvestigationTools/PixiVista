<script setup lang="ts">

import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import {DIContainer} from "@/lib/signal-visualizer/application/DIContainer.ts";
import {ResizeDto} from "@/lib/signal-visualizer/application/Commands/ResizeCommand.ts";
import {type CompatibleSignal, ViewPort} from "@/lib/signal-visualizer/application/SignalSource.ts";
import SliderComponent from "@/lib/signal-visualizer/presentation/SliderComponent.vue";
import SettingsComponent from "@/lib/signal-visualizer/presentation/SettingsComponent.vue";

const props = defineProps<{
    signalSources: CompatibleSignal[]
}>()


const htmlContainerRef = ref<HTMLDivElement | null>(null);
const resizeObserverRef = ref<ResizeObserver | null>(null)
let diContainer: DIContainer | null = null;

const totalSeconds = Math.max(...props.signalSources.map(signal => signal.totalSeconds))
const windowStartSeconds = ref(0)
const windowLengthSeconds = ref(10)


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

async function updateViewPort(currentPositionSeconds: number) {
    await diContainer?.updateViewPortHandler.handle(currentPositionSeconds)
}

async function changeWindowLength(windowLength : number) {
    windowLengthSeconds.value = windowLength
}

async function changeViewPort() {
    await diContainer?.changeViewPortHandler.handle(windowStartSeconds.value, windowLengthSeconds.value)
}

watch(
    () => windowLengthSeconds.value,
    () => changeViewPort()
)

</script>


<template>
    <SettingsComponent
        :windowLengthSeconds="windowLengthSeconds"
        @update-windowLength="changeWindowLength"
    >
    </SettingsComponent>
    <div ref="htmlContainerRef" class="plot_container"></div>
    <SliderComponent
        :windowStartSeconds="windowStartSeconds"
        :windowLengthSeconds="windowLengthSeconds"
        :totalSeconds=totalSeconds
        @update-value='updateViewPort'
    >
    </SliderComponent>

</template>

<style scoped>
.plot_container {
    width: 100%;
    height: 100%
}
</style>
