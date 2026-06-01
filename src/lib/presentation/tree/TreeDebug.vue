<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

import TreeView from '@/presentation/tree/TreeView.vue'
import type { TreeNodeLike } from '@/presentation/tree/treeNode'

type TreeDebugNode = TreeNodeLike<TreeDebugNode> & {
    label: string
    contentLines: string[]
}

const rootLabelPool = ['Root Alpha', 'Root Beta', 'Root Gamma', 'Root Delta']
const branchLabelPool = ['Branch', 'Cluster', 'Twig', 'Node']
const leafLabelPool = ['Leaf', 'Tip', 'Bud', 'Seed']
const treeMutationIntervalMs = 1800

let nextTreeNodeId = 0
let treeMutationTimer: number | undefined

const tree = ref<TreeDebugNode[]>(createRandomTree())

onMounted(() => {
    treeMutationTimer = window.setInterval(() => {
        const nodes = collectTreeNodes(tree.value)

        if (nodes.length === 0) {
            return
        }

        const node = pickRandom(nodes)
        const shouldAddLine = node.contentLines.length === 0 || Math.random() > 0.5

        if (shouldAddLine) {

            const randomLines = Math.round(Math.random() * 10)
            for (let i = 0; i < randomLines; i++){
                const nextLineNumber = node.contentLines.length + 1
                node.contentLines.push(`${node.label} — extra line ${nextLineNumber}`)
            }
            return
        }

        if (node.contentLines.length > 1) {
            const lineIndex = randomInt(0, node.contentLines.length - 1)
            node.contentLines.splice(lineIndex, 1)
        }
    }, treeMutationIntervalMs)
})

onBeforeUnmount(() => {
    if (treeMutationTimer !== undefined) {
        window.clearInterval(treeMutationTimer)
    }
})

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

    const lineCount = randomInt(1, 4) // variable number of content lines to produce different heights
    const contentLines = Array.from({ length: lineCount }, (_, i) => `${label} ${idNumber + 1} — line ${i + 1}`)

    return {
        id: `tree-debug-${idNumber}`,
        label: `${label} ${idNumber + 1}`,
        contentLines,
        children: Array.from({ length: childCount }, () => createTreeNode(depth + 1, maxDepth)),
    }
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickRandom<T>(values: readonly T[]): T {
    return values[randomInt(0, values.length - 1)]!
}

function collectTreeNodes(nodes: TreeDebugNode[]): TreeDebugNode[] {
    return nodes.flatMap((node) => [node, ...collectTreeNodes(node.children)])
}
</script>

<template>
    <div class="tree-debug">
        <div class="tree-debug__panel">
            <div v-for="node in tree" :key="node.id" class="tree-debug__column">
                <TreeView :node="node" v-slot="{ node }">
                    <div class="tree-debug__label">
                        <div v-for="(line, i) in node.contentLines" :key="i">{{ line }}</div>
                    </div>
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
</style>
