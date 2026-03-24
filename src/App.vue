<script setup lang="ts">
import PlotComponent from "@/lib/signal-visualizer/presentation/PlotComponent.vue";
import {
    TestSignalSource
} from "@/lib/signal-visualizer/infrastructure/signals/testSampledSignal.ts";

const signalSources = [
    new TestSignalSource("A", 200, 5000),
    new TestSignalSource("B", 200, 3000),
    new TestSignalSource("C", 200, 2000)]
</script>

<template>
    <PlotComponent :signalSources=signalSources>
    </PlotComponent>
</template>

<style scoped></style>
