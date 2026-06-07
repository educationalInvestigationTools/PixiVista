<script setup lang="ts">

import AnnotationTreeNode from '@/presentation/annotationsComponent/AnnotationTreeNode.vue'
import TreeView from '@/presentation/tree/TreeView.vue'
import type {
    AnnotationNode,
} from '@/presentation/annotationsComponent/objectAnnotationData'

const props = defineProps<{
    annotations: AnnotationNode[]
}>()

</script>

<template>
    <div class="annotations">
        <span class="annotations__heading">Annotations</span>

        <div class="annotations__panel">
            <div v-for="node in props.annotations" :key="node.id" class="annotations__column">
                <TreeView :node="node" v-slot="{ node: slotNode }">
                    <AnnotationTreeNode :node="slotNode" />
                </TreeView>
            </div>
            <span v-if="props.annotations.length === 0" class="annotations__empty">No annotations available.</span>
        </div>
    </div>
</template>

<style scoped>
.annotations {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 10px 4px 4px;
    background: var(--ui-panel-bg);
    border: 1px solid var(--ui-panel-border);
    color: var(--ui-text-primary);
    font-family: var(--ui-font);
}

.annotations__heading {
    display: block;
    padding: 4px 4px 0;
    letter-spacing: 1px;
    font-size: clamp(12px, 1.5vw, 14px);
    font-weight: 600;
    color: var(--ui-text-muted);
}

.annotations__panel {
    display: flex;
    flex-direction: row;
    gap: 10px;
    padding: 6px;
    background: var(--ui-panel-row-bg);
    border: 1px solid var(--ui-panel-border);
    height: auto;
    max-height: 240px;
    overflow-y: visible;
    font-size: clamp(13px, 1.5vw, 15px);
}

.annotations__column {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 0 0 260px;
    min-width: 220px;
}

.annotations__empty {
    color: var(--ui-text-muted);
    font-size: 13px;
}
</style>
