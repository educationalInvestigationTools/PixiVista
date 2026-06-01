<script setup lang="ts" generic="T extends TreeNodeLike<T>">
import { computed, ref } from 'vue'

import TreeConnector from '@/presentation/tree/TreeConnector.vue'
import TreeToggle from '@/presentation/tree/TreeToggle.vue'
import type { TreeNodeLike } from '@/presentation/tree/treeNode'

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

function toggleCollapse() {
    collapsed.value = !isCollapsed.value
}

const childAncestorHasNext = computed(() => {
    if (depth.value === 0) {
        return []
    }
    return [...ancestorHasNext.value, !isLast.value]
})

const childDepth = computed(() => depth.value + 1)
</script>

<template>
    <div class="tree-node">
        <div class="tree-node__row">
            <TreeConnector v-if="depth > 0" :isLast="isLast" :depth="depth" :ancestorHasNext="ancestorHasNext" />
            <TreeToggle
                class="tree-node__toggle"
                :hasChildren="hasChildren"
                :isCollapsed="isCollapsed"
                :toggleCollapse="toggleCollapse"
            />
            <div class="tree-node__content">
                <slot :node="props.node" />
            </div>
        </div>

        <div v-if="hasChildren && !isCollapsed" class="tree-node__children">
            <TreeView
                v-for="(child, index) in children"
                :key="child.id"
                :node="child"
                :depth="childDepth"
                :ancestorHasNext="childAncestorHasNext"
                :isLast="index === children.length - 1"
                v-slot="{ node }"
            >
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
    --tree-toggle-layout-size: 18px;
}

.tree-node__row {
    display: flex;
    align-items: stretch;
    column-gap: var(--tree-row-inline-gap, 6px);
    padding-block: calc(var(--tree-row-gap, 6px) / 2);
}

.tree-node__content {
    flex: 1 1 auto;
    min-width: 0;
    display: block;
}

.tree-node__toggle {
    flex: 0 0 auto;
    align-self: center;
}

.tree-node__children {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
</style>
