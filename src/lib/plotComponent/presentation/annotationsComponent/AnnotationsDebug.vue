<script setup lang="ts">
import { ref } from 'vue'

import AnnotationsComponent from '@/plotComponent/presentation/annotationsComponent/AnnotationsComponent.vue'
import type { AnnotationNode, AnnotationShape, AnnotationStyle } from '@/plotComponent/presentation/annotationsComponent/objectAnnotationData'

const rootLabelPool = ['Channels', 'Intervals', 'Events', 'Regions', 'Markers']
const branchLabelPool = ['Artifact', 'Signal', 'Window', 'Epoch', 'Cluster', 'Segment']
const leafLabelPool = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Marker A', 'Marker B', 'Blink', 'Movement', 'Response']
const colorPool = ['#334155', '#475569', '#f87171', '#38bdf8', '#22d3ee', '#f59e0b', '#a855f7', '#14b8a6', '#0ea5e9', '#7c3aed']
const drawingStylePool: AnnotationStyle['drawingStyle'][] = ['borders', 'background-rectangle', 'color-signal']
const shapePool: AnnotationShape[] = ['rectangle', 'dashed-lines']

let nextAnnotationId = 0

const annotations = ref<AnnotationNode[]>(createRandomAnnotationsTree())

function createRandomAnnotationsTree(): AnnotationNode[] {
    nextAnnotationId = 0

    const rootCount = randomInt(2, 4)
    const maxDepth = randomInt(2, 3)

    return Array.from({ length: rootCount }, () => createAnnotationNode(0, maxDepth))
}

function createAnnotationNode(depth: number, maxDepth: number): AnnotationNode {
    const idNumber = nextAnnotationId++
    const label = pickRandom(depth === 0 ? rootLabelPool : depth === maxDepth ? leafLabelPool : branchLabelPool)
    const canBranch = depth < maxDepth && (depth === 0 || Math.random() > 0.3)
    const childCount = canBranch ? randomInt(depth === maxDepth - 1 ? 0 : 1, depth === 0 ? 3 : 2) : 0

    return {
        id: `annotation-debug-${idNumber}`,
        label: `${label} ${idNumber + 1}`,
        style: createAnnotationStyle(depth),
        state: { visibility: Math.random() > 0.2 },
        children: Array.from({ length: childCount }, () => createAnnotationNode(depth + 1, maxDepth)),
    }
}

function createAnnotationStyle(depth: number): AnnotationStyle {
    return {
        color: pickRandom(colorPool),
        drawingStyle: depth === 0 ? pickRandom(drawingStylePool.slice(0, 2)) : pickRandom(drawingStylePool),
        shape: depth === 0 ? 'rectangle' : pickRandom(shapePool),
    }
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickRandom<T>(values: readonly T[]): T {
    return values[randomInt(0, values.length - 1)]!
}

function updateAnnotations(nextAnnotations: AnnotationNode[]) {
    annotations.value = nextAnnotations
}
</script>

<template>
    <AnnotationsComponent :annotations="annotations" @update:annotations="updateAnnotations" />
</template>

<style scoped></style>
