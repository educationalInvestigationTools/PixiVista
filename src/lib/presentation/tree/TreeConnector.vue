<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    isLast: boolean
    depth: number
    ancestorHasNext: boolean[]
}>()

const rowInlineGap = 6
const columnWidth = 18
const tailWidth = computed(() => 3 * Math.round(columnWidth / 2))
const viewBoxHeight = 5
const midY = viewBoxHeight / 2

const ancestorHasNext = computed(() => props.ancestorHasNext)
const columnCount = computed(() => Math.max(1, props.depth))
const svgWidth = computed(() => columnCount.value * (columnWidth + tailWidth.value + rowInlineGap) - rowInlineGap)
const branchX = computed(() =>
    (columnCount.value - 0.5) * columnWidth + Math.max(0, columnCount.value - 1) * (tailWidth.value + rowInlineGap),
)
const effectiveAncestorHasNext = computed(() =>
    ancestorHasNext.value.slice(0, Math.max(0, columnCount.value - 1)),
)
const cssWidth = computed(() => `${svgWidth.value}px`)

const ancestorLineXs = computed(() =>
    effectiveAncestorHasNext.value
        .map((hasNext, index) =>
            hasNext ? (index + 0.5) * columnWidth + index * (tailWidth.value + rowInlineGap) : null,
        )
        .filter((value): value is number => value !== null),
)
</script>

<template>
    <span class="tree-connector" :style="{ width: cssWidth }">
        <svg
            class="tree-connector__svg"
            :width="svgWidth"
            :height="viewBoxHeight"
            :viewBox="`0 0 ${svgWidth} ${viewBoxHeight}`"
            preserveAspectRatio="none"
            >
            <line
                v-for="(x, index) in ancestorLineXs"
                :key="`ancestor-${index}`"
                class="tree-connector__line"
                :x1="x"
                y1="0"
                :x2="x"
                :y2="viewBoxHeight" />
            <line
                class="tree-connector__line"
                :x1="branchX"
                y1="0"
                :x2="branchX"
                :y2="props.isLast ? midY : viewBoxHeight" />
            <line
                class="tree-connector__line"
                :x1="branchX"
                :y1="midY"
                :x2="svgWidth"
                :y2="midY" />
        </svg>
    </span>
</template>

<style scoped>
.tree-connector {
    position: relative;
    display: block;
    flex: 0 0 auto;
    box-sizing: border-box;
    pointer-events: none;
    color: var(--tree-connector-color, var(--ui-text-muted));
}

.tree-connector__svg {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
}

.tree-connector__line {
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: square;
    vector-effect: non-scaling-stroke;
    shape-rendering: crispEdges;
}
</style>
