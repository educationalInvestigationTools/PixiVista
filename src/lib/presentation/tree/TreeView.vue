<script setup lang="ts" generic="T extends TreeNodeLike<T>">
import { computed } from 'vue'

import TreeConnector from '@/presentation/tree/TreeConnector.vue'
import type { TreeNodeLike } from '@/presentation/tree/treeTypes'

defineOptions({ name: 'TreeView' })

type TreeSlotProps<TNode extends TreeNodeLike<TNode>> = {
    node: TNode
    depth: number
    isLast: boolean
    ancestorHasNext: boolean[]
    hasChildren: boolean
    isCollapsed: boolean
    toggleCollapse: () => void
}

const props = defineProps<{
    node: T
    depth: number
    ancestorHasNext: boolean[]
    isLast: boolean
    collapsedState: Record<string, boolean>
}>()

defineSlots<{
    default(props: TreeSlotProps<T>): unknown
}>()

const emit = defineEmits<{
    (e: 'update:collapsedState', value: Record<string, boolean>): void
}>()

const depth = computed(() => props.depth)
const ancestorHasNext = computed(() => props.ancestorHasNext)
const isLast = computed(() => props.isLast)

const children = computed<T[]>(() => {
    const value = props.node.children
    return Array.isArray(value) ? value : []
})

const hasChildren = computed(() => children.value.length > 0)

const collapsedState = computed(() => props.collapsedState)
const isCollapsed = computed(() => !!collapsedState.value[props.node.id])

const childAncestorHasNext = computed(() => {
    if (depth.value === 0) {
        return []
    }
    return [...ancestorHasNext.value, !isLast.value]
})

const childDepth = computed(() => depth.value + 1)

function updateCollapsedState(nextState: Record<string, boolean>) {
    emit('update:collapsedState', nextState)
}

function toggleCollapse() {
    if (!hasChildren.value) {
        return
    }
    const nextState = { ...collapsedState.value, [props.node.id]: !isCollapsed.value }
    updateCollapsedState(nextState)
}
</script>

<template>
    <div class="tree-node">
        <div class="tree-node__row">
            <TreeConnector
                v-if="depth > 0"
                :isLast="isLast"
                :depth="depth"
                :ancestorHasNext="ancestorHasNext" />
            <slot
                :node="props.node"
                :depth="depth"
                :isLast="isLast"
                :ancestorHasNext="ancestorHasNext"
                :hasChildren="hasChildren"
                :isCollapsed="isCollapsed"
                :toggleCollapse="toggleCollapse" />
        </div>

        <div v-if="hasChildren && !isCollapsed" class="tree-node__children">
            <TreeView
                v-for="(child, index) in children"
                :key="child.id"
                :node="child"
                :depth="childDepth"
                :ancestorHasNext="childAncestorHasNext"
                :isLast="index === children.length - 1"
                :collapsedState="collapsedState"
                @update:collapsedState="updateCollapsedState">
                <template #default="{ node, depth, isLast, ancestorHasNext, hasChildren, isCollapsed, toggleCollapse }">
                    <slot
                        :node="node"
                        :depth="depth"
                        :isLast="isLast"
                        :ancestorHasNext="ancestorHasNext"
                        :hasChildren="hasChildren"
                        :isCollapsed="isCollapsed"
                        :toggleCollapse="toggleCollapse" />
                </template>
            </TreeView>
        </div>
    </div>
</template>

<style scoped>
.tree-node {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.tree-node__row {
    display: flex;
    align-items: center;
    gap: 0;
}

.tree-node__children {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
</style>
