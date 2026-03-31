<script setup lang="ts">
import PlotComponent from "@/lib/signal-visualizer/presentation/PlotComponent.vue";
import {
    TestSignalSource
} from "@/lib/signal-visualizer/infrastructure/signals/testSampledSignal.ts";

const signalSources = [
    new TestSignalSource("A", 1000, 60),
    new TestSignalSource("B", 1000, 30),
    new TestSignalSource("C", 1000, 20),
    new TestSignalSource("D", 1000, 10),
    new TestSignalSource("E", 1000, 60)]
</script>

<template>
    <PlotComponent :annotations="{}" :signalSources=signalSources>
    </PlotComponent>
</template>

<style scoped></style>
