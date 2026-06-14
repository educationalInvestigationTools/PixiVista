<script setup lang="ts" generic="T extends TreeNodeLike<T>">
import type { TreeNodeLike } from '@/presentation/tree/treeNode';
import TreeView from '@/presentation/tree/TreeView.vue'

defineProps<{
    nodes: T[]
    show: boolean
}>()
</script>

<template>
    <div class="tree-panel">
        <div class="tree-panel__header">
            <slot name="header" />
        </div>

        <div v-if="show" class="tree-panel__content">
            <div v-for="node in nodes" :key="node.id" class="tree-panel__root">
                <TreeView :node="node" v-slot="{ node: slotNode }">
                    <slot name="node" :node="slotNode" />
                </TreeView>
            </div>

            <slot name="empty" v-if="nodes.length === 0" />
        </div>
    </div>
</template>

<style scoped>
.tree-panel {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 15px;
    max-height: 360px;

    background: var(--ui-panel-bg);
    border: 1px solid var(--ui-panel-border);
    font-family: var(--ui-font);
    color: var(--ui-text-muted);
    font-weight: 600;
}

.tree-panel__header {
    height: 15px;
    display: flex;
    align-items: center;
    gap: 0px 5px;
    margin-left: 5px;
}

.tree-panel__content {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    overflow-y: auto;
}

.tree-panel__root {
    flex: 0 0 auto;
    padding: 6px;
    border: 1px solid var(--ui-panel-border);
    background: var(--ui-panel-row-bg);
    overflow-y: auto;
}
</style>
