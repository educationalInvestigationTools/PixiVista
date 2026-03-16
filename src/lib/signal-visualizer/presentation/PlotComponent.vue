<script setup lang="ts">

import {onBeforeUnmount, onMounted, ref} from "vue";
import {DIContainer} from "@/lib/signal-visualizer/application/DIContainer.ts";
import {ResizeDto} from "@/lib/signal-visualizer/application/Commands/ResizeCommand.ts";
import {TestSignalSource} from "@/lib/signal-visualizer/infrastructure/test-sampled-signal.ts";

const htmlContainerRef = ref<HTMLDivElement | null>(null);
let diContainer: DIContainer | null = null;

onMounted(() => {
    if (!htmlContainerRef.value) {
        return;
    }
    diContainer = new DIContainer(htmlContainerRef.value, new TestSignalSource(200, 200, 5));

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
