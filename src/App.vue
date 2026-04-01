<script setup lang="ts">
import PlotComponent from "@/lib/signal-visualizer/presentation/PlotComponent.vue";
import {
    TestSignalSource
} from "@/lib/signal-visualizer/infrastructure/signals/testSampledSignal.ts";
import type { HighlightedInterval, IntervalGroup } from "./lib/signal-visualizer/application/types/highlightedInterval";

const signalSources = [
    new TestSignalSource("A", 1000, 60),
    new TestSignalSource("B", 1000, 30),
    new TestSignalSource("C", 1000, 20),
    new TestSignalSource("D", 1000, 10),
    new TestSignalSource("E", 1000, 60)]


const interval1: HighlightedInterval = {
    startSeconds: 0,
    endSeconds: 10,
    label: "N1",
    signalsAssociated: ["A", "B", "C"],
    drawingColor: 'red',
    drawingStyle: 'background-rectangle',
    hoverInfo: {
        "nada": "mucho",
    }
}

const group: IntervalGroup = {
    label: 'Sleep Stages',
    priority: 0,
    intervals: [interval1]
}

const annotations: Record<string, IntervalGroup> = {}
annotations[group.label] = group

</script>


<template>
    <PlotComponent :annotations="annotations" :signalSources=signalSources>
    </PlotComponent>
</template>

<style scoped></style>
