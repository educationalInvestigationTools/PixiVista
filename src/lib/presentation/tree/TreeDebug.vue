<script setup lang="ts">
import { ref } from 'vue'

import TreeView from '@/presentation/tree/TreeView.vue'
import type { TreeNodeLike } from '@/presentation/tree/treeTypes'

type TreeDebugNode = TreeNodeLike<TreeDebugNode> & {
    label: string
}

const rootLabelPool = ['Root Alpha', 'Root Beta', 'Root Gamma', 'Root Delta']
const branchLabelPool = ['Branch', 'Cluster', 'Twig', 'Node']
const leafLabelPool = ['Leaf', 'Tip', 'Bud', 'Seed']

let nextTreeNodeId = 0

const tree = ref<TreeDebugNode[]>(createRandomTree())

const collapsedState = ref<Record<string, boolean>>({})

function createRandomTree(): TreeDebugNode[] {
    nextTreeNodeId = 0

    const rootCount = randomInt(2, 4)
    const maxDepth = randomInt(2, 3)

    return Array.from({ length: rootCount }, () => createTreeNode(0, maxDepth))
}

function createTreeNode(depth: number, maxDepth: number): TreeDebugNode {
    const idNumber = nextTreeNodeId++
    const label = pickRandom(depth === 0 ? rootLabelPool : depth === maxDepth ? leafLabelPool : branchLabelPool)
    const canBranch = depth < maxDepth && (depth === 0 || Math.random() > 0.25)
    const childCount = canBranch ? randomInt(depth === maxDepth - 1 ? 0 : 1, depth === 0 ? 3 : 2) : 0

    return {
        id: `tree-debug-${idNumber}`,
        label: `${label} ${idNumber + 1}`,
        children: Array.from({ length: childCount }, () => createTreeNode(depth + 1, maxDepth)),
    }
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickRandom<T>(values: readonly T[]): T {
    return values[randomInt(0, values.length - 1)]!
}
</script>

<template>
    <div class="tree-debug">
        <div class="tree-debug__panel">
            <div v-for="node in tree" :key="node.id" class="tree-debug__column">
                <TreeView :node="node" :depth="0" :ancestorHasNext="[]" :isLast="true" v-model:collapsedState="collapsedState">
                    <template #default="{ node, hasChildren }">
                        <span class="tree-debug__label" :class="{ 'tree-debug__label--leaf': !hasChildren }">
                            {{ node.label }}
                        </span>
                    </template>
                </TreeView>
            </div>
        </div>
    </div>
</template>

<style scoped>
.tree-debug {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 4px;
    background: var(--ui-panel-bg);
    border: 1px solid var(--ui-panel-border);
    color: var(--ui-text-primary);
    font-family: var(--ui-font);
}

.tree-debug__panel {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: 8px;
    padding: 6px;
    border: 1px solid var(--ui-panel-border);
    background: var(--ui-panel-row-bg);
    overflow: auto;
    --tree-row-height: 36px;
    --tree-row-gap: 8px;
}

.tree-debug__column {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 0 0 260px;
    min-width: 220px;
    padding: 6px;
    border: 1px solid var(--ui-panel-border);
    background: var(--ui-panel-row-bg);
}

.tree-debug__label {
    font-size: 14px;
    line-height: 1.3;
    color: var(--ui-text-primary);
}

.tree-debug__label--leaf {
    text-decoration: none;
}
</style>
