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
    <div v-for="node in tree" :key="node.id" class="tree-debug__root">
        <TreeView :node="node" :depth="0" :ancestorHasNext="[]" :isLast="true" v-model:collapsedState="collapsedState">
            <template #default="{ node, hasChildren }">
                <span class="tree-debug__label" :class="{ 'tree-debug__label--leaf': !hasChildren }">
                    {{ node.label }}
                </span>
            </template>
        </TreeView>
    </div>
</template>

<style scoped>
.tree-debug {
    min-height: 100vh;
    padding: 24px;
    box-sizing: border-box;
    background:
        radial-gradient(circle at top left, rgba(255, 255, 255, 0.08), transparent 32%),
        linear-gradient(180deg, rgba(10, 12, 18, 1), rgba(19, 24, 34, 1));
    color: var(--ui-text-primary);
    font-family: var(--ui-font);
}

.tree-debug__header {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 18px;
}

.tree-debug__title {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 0.02em;
}

.tree-debug__subtitle {
    margin: 0;
    color: var(--ui-text-muted);
    font-size: 13px;
}

.tree-debug__panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    border: 1px solid var(--ui-panel-border);
    border-radius: 14px;
    background: var(--ui-panel-bg);
    overflow: auto;
    --tree-row-height: 36px;
    --tree-row-gap: 8px;
}

.tree-debug__root {
    padding: 10px;
    border: 1px solid var(--ui-panel-border);
    border-radius: 10px;
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
