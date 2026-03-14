<script setup lang="ts">

import {Container} from "@/lib/signal-visualizer/application/Container.ts";
import {PixiRenderer} from "@/lib/signal-visualizer/infrastructure/pixi-renderer.ts";
import {onBeforeUnmount, onMounted, ref} from "vue";

const htmlContainerRef = ref<HTMLDivElement | null>(null);
let container: Container | null = null;

onMounted(() => {
    if (!htmlContainerRef.value) {
        return;
    }
    const renderer = new PixiRenderer()
    container = new Container(renderer, htmlContainerRef.value)

    const ro = new ResizeObserver(() => {
        if (htmlContainerRef.value) {
            const width = htmlContainerRef.value.clientWidth;
            const height = htmlContainerRef.value.clientHeight;
            container?.resize(width, height);
        }
    })
    ro.observe(htmlContainerRef.value);
    onBeforeUnmount(() => ro.disconnect())
})

onBeforeUnmount(() => {
    container?.renderer.destroy();
    container = null;
})

</script>

<template>

    <div ref="htmlContainerRef" ></div>


</template>

<style scoped>

</style>
