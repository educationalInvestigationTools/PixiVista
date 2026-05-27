<script setup lang="ts">
import { ref } from 'vue'

import AnnotationsComponent from '@/plotComponent/presentation/annotationsComponent/AnnotationsComponent.vue'
import type { AnnotationsTree } from '@/plotComponent/presentation/annotationsComponent/objectAnnotationData'

const annotations = ref<AnnotationsTree>([
    {
        id: 'channels',
        label: 'Channels',
        style: {
            color: '#334155',
            drawingStyle: 'borders',
            shape: 'rectangle',
        },
        state: { visibility: true },
        children: [
            {
                id: 'channel:alpha',
                label: 'Alpha Channel',
                style: {
                    color: '#f87171',
                    drawingStyle: 'borders',
                    shape: 'rectangle',
                },
                state: { visibility: true },
                children : []
            },
            {
                id: 'channel:beta',
                label: 'Beta Channel',
                style: {
                    color: '#38bdf8',
                    drawingStyle: 'borders',
                    shape: 'rectangle',
                },
                state: { visibility: true },
                children : []
            },
            {
                id: 'channel:gamma',
                label: 'Gamma Channel',
                style: {
                    color: '#22d3ee',
                    drawingStyle: 'borders',
                    shape: 'rectangle',
                },
                state: { visibility: true },
                children : []
            },
        ],
    },
    {
        id: 'intervals',
        label: 'Intervals',
        style: {
            color: '#475569',
            drawingStyle: 'borders',
            shape: 'dashed-lines',
        },
        state: { visibility: true },
        children: [
            {
                id: 'intervals:artifacts',
                label: 'Artifacts',
                style: {
                    color: '#f59e0b',
                    drawingStyle: 'background-rectangle',
                    shape: 'dashed-lines',
                },
                state: { visibility: true },
                children: [
                    {
                        id: 'intervals:artifacts:blink',
                        label: 'Blink',
                        style: {
                            color: '#fbbf24',
                            drawingStyle: 'background-rectangle',
                            shape: 'dashed-lines',
                        },
                        state: { visibility: true },
                        children : []
                    },
                    {
                        id: 'intervals:artifacts:movement',
                        label: 'Movement',
                        style: {
                            color: '#f97316',
                            drawingStyle: 'background-rectangle',
                            shape: 'dashed-lines',
                        },
                        state: { visibility: true },
                        children : []
                    },
                ],
            },
            {
                id: 'intervals:events',
                label: 'Events',
                style: {
                    color: '#a855f7',
                    drawingStyle: 'borders',
                    shape: 'dashed-lines',
                },
                state: { visibility: true },
                children: [
                    {
                        id: 'intervals:events:stimulus',
                        label: 'Stimulus',
                        style: {
                            color: '#14b8a6',
                            drawingStyle: 'color-signal',
                            shape: 'dashed-lines',
                        },
                        state: { visibility: true },
                        children: [
                            {
                                id: 'intervals:events:stimulus:marker-a',
                                label: 'Marker A',
                                style: {
                                    color: '#0ea5e9',
                                    drawingStyle: 'color-signal',
                                    shape: 'dashed-lines',
                                },
                                state: { visibility: true },
                                children : []
                            },
                        ],
                    },
                    {
                        id: 'intervals:events:response',
                        label: 'Response',
                        style: {
                            color: '#7c3aed',
                            drawingStyle: 'borders',
                            shape: 'dashed-lines',
                        },
                        state: { visibility: true },
                        children : []
                    },
                ],
            },
        ],
    },
])

function updateAnnotations(nextAnnotations: AnnotationsTree) {
    annotations.value = nextAnnotations
}
</script>

<template>
    <AnnotationsComponent :annotations="annotations" @update:annotations="updateAnnotations" />
</template>

<style scoped></style>
