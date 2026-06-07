<script setup lang="ts">
import { ref } from 'vue'

import AnnotationsComponent from '@/plotComponent/presentation/annotationsComponent/AnnotationsComponent.vue'
import { type AnnotationShape } from '@/plotComponent/presentation/annotationsComponent/objectAnnotationData'
import { DebugAnnotationNode } from '@/plotComponent/presentation/annotationsComponent/DebugNode'

const rootLabelPool = ['Channels', 'Intervals', 'Events', 'Regions', 'Markers']
const branchLabelPool = ['Artifact', 'Signal', 'Window', 'Epoch', 'Cluster', 'Segment']
const leafLabelPool = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Marker A', 'Marker B', 'Blink', 'Movement', 'Response']
const colorPool = ['#334155', '#475569', '#f87171', '#38bdf8', '#22d3ee', '#f59e0b', '#a855f7', '#14b8a6', '#0ea5e9', '#7c3aed']
const shapePool: AnnotationShape[] = ['rectangle', 'dashed-lines']

let nextAnnotationId = 0

const annotations = ref<DebugAnnotationNode[]>(createRandomAnnotationsTree())

function createRandomAnnotationsTree(): DebugAnnotationNode[] {
    nextAnnotationId = 0

    const rootCount = randomInt(2, 4)
    const maxDepth = randomInt(2, 3)

    return Array.from({ length: rootCount }, () => createAnnotationNode(0, maxDepth))
}

function createAnnotationNode(depth: number, maxDepth: number): DebugAnnotationNode {
    const idNumber = nextAnnotationId++
    const label = pickRandom(depth === 0 ? rootLabelPool : depth === maxDepth ? leafLabelPool : branchLabelPool)
    const canBranch = depth < maxDepth && (depth === 0 || Math.random() > 0.3)
    const childCount = canBranch ? randomInt(depth === maxDepth - 1 ? 0 : 1, depth === 0 ? 3 : 2) : 0

    const children = Array.from({ length: childCount }, () => createAnnotationNode(depth + 1, maxDepth))

    // Random style values
    const color = pickRandom(colorPool)
    const shape = depth === 0 ? 'rectangle' : pickRandom(shapePool)
    const visibility = Math.random() > 0.2   // true most of the time

    return new DebugAnnotationNode(
        `annotation-debug-${idNumber}`,
        `${label} ${idNumber + 1}`,
        children,
        color,
        shape,
        visibility
    )
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickRandom<T>(values: readonly T[]): T {
    return values[randomInt(0, values.length - 1)]!
}

</script>

<template>
    <AnnotationsComponent :annotations="annotations" />
</template>

<style scoped></style>
