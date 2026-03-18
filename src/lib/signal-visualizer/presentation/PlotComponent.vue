<script setup lang="ts">

import { onBeforeUnmount, onMounted, ref } from "vue";
import { DIContainer } from "@/lib/signal-visualizer/application/DIContainer.ts";
import { ResizeDto } from "@/lib/signal-visualizer/application/Commands/ResizeCommand.ts";
import {
    TestSignalSource
} from "@/lib/signal-visualizer/infrastructure/signals/test-sampled-signal.ts";
import { ViewPort } from "@/lib/signal-visualizer/application/SignalSource.ts";

const htmlContainerRef = ref<HTMLDivElement | null>(null);
const resizeObserverRef = ref<ResizeObserver | null>(null)
let diContainer: DIContainer | null = null;

onMounted(async () => {
    if (!htmlContainerRef.value) {
        return;
    }
    const viewPort = new ViewPort(0, 10)
    diContainer = new DIContainer(htmlContainerRef.value, viewPort, [new TestSignalSource(200, 2000)]);
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

</script>

<template>
    <div ref="htmlContainerRef" class="plot_container"></div>
</template>

<style scoped>
.plot_container {
    width: 100%;
    height: 100%
}
</style>
