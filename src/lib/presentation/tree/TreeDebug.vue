<script setup lang="ts">
import { ref } from 'vue'

import TreeView from '@/presentation/tree/TreeView.vue'
import type { TreeNodeLike } from '@/presentation/tree/treeTypes'

type TreeDebugNode = TreeNodeLike<TreeDebugNode> & {
    label: string
}

const tree = ref<TreeDebugNode[]>([
    {
        id: 'root-alpha',
        label: 'Root Alpha',
        children: [
            {
                id: 'alpha-1',
                label: 'Alpha 1',
                children: [],
            },
            {
                id: 'alpha-2',
                label: 'Alpha 2',
                children: [
                    {
                        id: 'alpha-2-a',
                        label: 'Alpha 2A',
                        children: [],
                    },
                    {
                        id: 'alpha-2-b',
                        label: 'Alpha 2B',
                        children: [],
                    },
                ],
            },
        ],
    },
    {
        id: 'root-beta',
        label: 'Root Beta',
        children: [
            {
                id: 'beta-1',
                label: 'Beta 1',
                children: [],
            },
        ],
    },
])

const collapsedState = ref<Record<string, boolean>>({})
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
