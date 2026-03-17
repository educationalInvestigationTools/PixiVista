<script setup lang="ts">

import {onBeforeUnmount, onMounted, ref} from "vue";
import {DIContainer} from "@/lib/signal-visualizer/application/DIContainer.ts";
import {ResizeDto} from "@/lib/signal-visualizer/application/Commands/ResizeCommand.ts";
import {
    TestSignalSource
} from "@/lib/signal-visualizer/infrastructure/signals/test-sampled-signal.ts";
import {ViewPort} from "@/lib/signal-visualizer/application/SignalSource.ts";

const htmlContainerRef = ref<HTMLDivElement | null>(null);
let diContainer: DIContainer | null = null;

onMounted(async () => {
    if (!htmlContainerRef.value) {
        return;
    }
    const viewPort = new ViewPort(0, 10)
    diContainer = new DIContainer(htmlContainerRef.value, viewPort, [new TestSignalSource(200, 2000)]);
    await diContainer.init()

    const ro = new ResizeObserver(() => {
        if (htmlContainerRef.value) {
            const width = htmlContainerRef.value.clientWidth;
            const height = htmlContainerRef.value.clientHeight;
            diContainer?.resizeHandler.handle(new ResizeDto(width, height));
        }
    })
    ro.observe(htmlContainerRef.value);
    onBeforeUnmount(() => ro.disconnect())
})

onBeforeUnmount(() => {
    diContainer?.destroyHandler.handle()
})

</script>

<template>
    <div ref="htmlContainerRef"></div>
</template>

<style scoped>

</style>
