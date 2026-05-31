<script setup lang="ts" generic="T extends TreeNodeLike<T>">
import { computed, onBeforeUnmount, onMounted, provide, ref } from 'vue'

import TreeConnector from '@/presentation/tree/TreeConnector.vue'
import TreeRow from '@/presentation/tree/TreeRow.vue'
import type { TreeNodeLike } from '@/presentation/tree/treeNode'
import { TREE_ROW_METRICS_KEY, resolveTreeToggleSize } from '@/presentation/tree/treeLayout'

defineOptions({ name: 'TreeView' })

type TreeSlotProps<TNode extends TreeNodeLike<TNode>> = {
    node: TNode
}

const props = defineProps<{
    node: T
    depth: number
    ancestorHasNext: boolean[]
    isLast: boolean
}>()

defineSlots<{
    default(props: TreeSlotProps<T>): unknown
}>()

const depth = computed(() => props.depth)
const ancestorHasNext = computed(() => props.ancestorHasNext)
const isLast = computed(() => props.isLast)

const children = computed<T[]>(() => {
    const value = props.node.children
    return value
})

const hasChildren = computed(() => children.value.length > 0)

const collapsed = ref(false)
const isCollapsed = computed(() => collapsed.value)
const rowElement = ref<HTMLElement | null>(null)
const rowHeight = ref(0)
const toggleSize = computed(() => resolveTreeToggleSize(rowHeight.value))

let resizeObserver: ResizeObserver | null = null

provide(TREE_ROW_METRICS_KEY, {
    toggleSize,
})

const childAncestorHasNext = computed(() => {
    if (depth.value === 0) {
        return []
    }
    return [...ancestorHasNext.value, !isLast.value]
})

const childDepth = computed(() => depth.value + 1)

function updateRowHeight(height: number) {
    rowHeight.value = height > 0 ? height : rowHeight.value
}

onMounted(() => {
    if (!rowElement.value) {
        return
    }

    updateRowHeight(rowElement.value.getBoundingClientRect().height)

    resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0]
        if (!entry) {
            return
        }
        updateRowHeight(entry.contentRect.height)
    })

    resizeObserver.observe(rowElement.value)
})

onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
})

function toggleCollapse() {
    collapsed.value = !isCollapsed.value
}
</script>

<template>
    <div class="tree-node">
        <div ref="rowElement" class="tree-node__row">
            <TreeConnector v-if="depth > 0" :isLast="isLast" :depth="depth" :ancestorHasNext="ancestorHasNext" />
            <TreeRow :hasChildren="hasChildren" :isCollapsed="isCollapsed" :toggleCollapse="toggleCollapse">
                <slot :node="props.node" />
            </TreeRow>
        </div>

        <div v-if="hasChildren && !isCollapsed" class="tree-node__children">
            <TreeView v-for="(child, index) in children" :key="child.id" :node="child" :depth="childDepth"
                :ancestorHasNext="childAncestorHasNext" :isLast="index === children.length - 1" v-slot="{ node }">
                <slot :node="node" />
            </TreeView>
        </div>
    </div>
</template>

<style scoped>
.tree-node {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    --tree-connector-gap: var(--tree-row-gap, 6px);
}

.tree-node__row {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: auto;
    align-items: stretch;
    column-gap: var(--tree-row-inline-gap, 6px);
}

.tree-node__children {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--tree-row-gap, 6px);
    margin-top: var(--tree-row-gap, 6px);
}
</style>
