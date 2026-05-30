<script setup lang="ts">
import { TREE_CONNECTOR_TAIL_WIDTH, TREE_TOGGLE_WIDTH } from '@/presentation/tree/treeLayout';
import { computed } from 'vue'


const props = defineProps<{
    isLast: boolean
    depth: number
    ancestorHasNext: boolean[]
}>()

const rowInlineGap = 6
const columnWidth = TREE_TOGGLE_WIDTH
const tailWidth = TREE_CONNECTOR_TAIL_WIDTH
const viewBoxHeight = 5
const midY = viewBoxHeight / 2

const ancestorHasNext = computed(() => props.ancestorHasNext)
const columnCount = computed(() => Math.max(1, props.depth))
const svgWidth = computed(() => columnCount.value * (columnWidth + tailWidth + rowInlineGap) - rowInlineGap)
const branchX = computed(() =>
    (columnCount.value - 0.5) * columnWidth + Math.max(0, columnCount.value - 1) * (tailWidth + rowInlineGap),
)
const effectiveAncestorHasNext = computed(() =>
    ancestorHasNext.value.slice(0, Math.max(0, columnCount.value - 1)),
)
const cssWidth = computed(() => `${columnCount.value * (columnWidth + tailWidth + rowInlineGap) - rowInlineGap}px`)

const ancestorLineXs = computed(() =>
    effectiveAncestorHasNext.value
        .map((hasNext, index) =>
            hasNext ? (index + 0.5) * columnWidth + index * (tailWidth + rowInlineGap) : null,
        )
        .filter((value): value is number => value !== null),
)
</script>

<template>
    <span class="tree-connector" :style="{ '--tree-connector-width': cssWidth }">
        <svg
            class="tree-connector__svg"
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
    display: inline-flex;
    align-items: center;
    width: var(--tree-connector-width);
    box-sizing: border-box;
    margin-left: var(--tree-row-offset, 0px);
    margin-bottom: calc(var(--tree-connector-gap, 0px) * -1);
    padding-bottom: var(--tree-connector-gap, 0px);
    color: var(--tree-connector-color, var(--ui-text-muted));
}

.tree-connector__svg {
    width: var(--tree-connector-width);
    height: calc(100% + var(--tree-connector-gap, 0px));
}

.tree-connector__line {
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: square;
    vector-effect: non-scaling-stroke;
    shape-rendering: crispEdges;
}
</style>
