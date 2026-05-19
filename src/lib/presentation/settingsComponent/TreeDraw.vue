<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    isLast: boolean
    depth: number
    ancestorHasNext: boolean[]
}>()

const indentWidth = 4
const columnWidth = indentWidth
const viewBoxHeight = 24
const midY = viewBoxHeight / 2

const ancestorHasNext = computed(() => props.ancestorHasNext ?? [])
const columnCount = computed(() => Math.max(1, props.depth))
const svgWidth = computed(() => columnCount.value * columnWidth)
const branchX = computed(() => (columnCount.value - 0.5) * columnWidth)
const effectiveAncestorHasNext = computed(() =>
    ancestorHasNext.value.slice(0, Math.max(0, columnCount.value - 1)),
)
const cssWidth = computed(() => `${columnCount.value * indentWidth}ch`)

const ancestorLineXs = computed(() =>
    effectiveAncestorHasNext.value
        .map((hasNext, index) => (hasNext ? (index + 0.5) * columnWidth : null))
        .filter((value): value is number => value !== null),
)
</script>

<template>
    <span class="tree-draw" :style="{ '--tree-draw-width': cssWidth }">
        <svg
            class="tree-draw__svg"
            :viewBox="`0 0 ${svgWidth} ${viewBoxHeight}`"
            preserveAspectRatio="none"
            >
            <line
                v-for="(x, index) in ancestorLineXs"
                :key="`ancestor-${index}`"
                class="tree-draw__line"
                :x1="x"
                y1="0"
                :x2="x"
                :y2="viewBoxHeight" />
            <line
                class="tree-draw__line"
                :x1="branchX"
                y1="0"
                :x2="branchX"
                :y2="props.isLast ? midY : viewBoxHeight" />
            <line
                class="tree-draw__line"
                :x1="branchX"
                :y1="midY"
                :x2="svgWidth"
                :y2="midY" />
        </svg>
    </span>

</template>

<style scoped>
.tree-draw {
    display: inline-flex;
    align-items: center;
    height: var(--ui-setting-row-height);
    width: var(--tree-draw-width);
    box-sizing: border-box;
    background: var(--ui-panel-row-bg);
    border: 1px solid var(--ui-panel-border);
    font-family: var(--ui-font-mono);
    color: var(--ui-text-muted);
}

.tree-draw__svg {
    width: var(--tree-draw-width);
    height: 100%;
}

.tree-draw__line {
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: square;
    vector-effect: non-scaling-stroke;
    shape-rendering: crispEdges;
}

</style>
