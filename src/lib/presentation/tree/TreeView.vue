<script setup lang="ts" generic="T extends TreeNodeLike<T>">
import { computed, ref } from 'vue'

import TreeConnector from '@/presentation/tree/TreeConnector.vue'
import TreeToggle from '@/presentation/tree/TreeToggle.vue'
import type { TreeNodeLike } from '@/presentation/tree/treeNode'

type TreeSlotProps<TNode extends TreeNodeLike<TNode>> = {
    node: TNode
}

type TreeData = {
    depth: number
    ancestorHasNext: boolean[]
    isLast: boolean
}

const props = withDefaults(defineProps<{
    node: T
    treeData?: TreeData
}>(), {
    treeData: () => ({
        depth: 0,
        ancestorHasNext: [],
        isLast: true,
    }),
})

defineSlots<{
    default(props: TreeSlotProps<T>): unknown
}>()

const depth = computed(() => props.treeData.depth)
const ancestorHasNext = computed(() => props.treeData.ancestorHasNext)
const isLast = computed(() => props.treeData.isLast)

const children = computed<T[]>(() => {
    return props.node.children
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
                :treeData="{
                    depth: depth + 1,
                    ancestorHasNext: childAncestorHasNext,
                    isLast: index === children.length - 1,
                }"
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
}

.tree-node__row {
    display: flex;
    column-gap: 6px;
    padding-block: 3px;
}

.tree-node__content {
    flex: 1 1 auto;
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
