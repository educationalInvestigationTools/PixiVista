<script setup lang="ts">
import PlotComponent from "@/lib/signal-visualizer/presentation/PlotComponent.vue";
import {
    TestSignalSource
} from "@/lib/signal-visualizer/infrastructure/signals/test-sampled-signal.ts";

const signalSources = [
    new TestSignalSource(200, 5000),
    new TestSignalSource(200, 3000),
    new TestSignalSource(200, 2000)]
</script>

<template>
    <PlotComponent :signalSources=signalSources>
    </PlotComponent>
</template>

<style scoped></style>
