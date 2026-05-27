<script setup lang="ts">
import { ref } from 'vue'

import AnnotationTreeNode from '@/plotComponent/presentation/annotationsComponent/AnnotationTreeNode.vue'
import TreeView from '@/presentation/tree/TreeView.vue'
import type {
    AnnotationColorChange,
    AnnotationNode,
    AnnotationShape,
    AnnotationShapeChange,
    AnnotationVisibilityChange,
    AnnotationsTree,
} from '@/plotComponent/presentation/annotationsComponent/objectAnnotationData'

type UpdatePayload = {
    ids: string[]
    visibility?: boolean
    color?: string
    shape?: AnnotationShape
}

type SubtreeUpdate = {
    node: AnnotationNode
    ids: string[]
}

type TreeUpdateResult = {
    nodes: AnnotationNode[]
    payload: UpdatePayload | null
}

const props = defineProps<{
    annotations: AnnotationsTree
}>()

const emit = defineEmits<{
    (e: 'update:annotations', value: AnnotationsTree): void
    (e: 'change:visibility', value: AnnotationVisibilityChange): void
    (e: 'change:color', value: AnnotationColorChange): void
    (e: 'change:shape', value: AnnotationShapeChange): void
}>()

const collapsedState = ref<Record<string, boolean>>({})

function applyVisibilityToSubtree(node: AnnotationNode, visibility: boolean): SubtreeUpdate {
    const ids: string[] = [node.id]
    const nextChildren = node.children?.map((child) => {
        const result = applyVisibilityToSubtree(child, visibility)
        ids.push(...result.ids)
        return result.node
    })
    return {
        node: {
            ...node,
            state: { ...node.state, visibility },
            children: nextChildren,
        },
        ids,
    }
}

function applyColorToSubtree(node: AnnotationNode, color: string): SubtreeUpdate {
    const ids: string[] = [node.id]
    const nextChildren = node.children?.map((child) => {
        const result = applyColorToSubtree(child, color)
        ids.push(...result.ids)
        return result.node
    })
    return {
        node: {
            ...node,
            style: { ...node.style, color },
            children: nextChildren,
        },
        ids,
    }
}

function applyShapeToSubtree(node: AnnotationNode, shape: AnnotationShape): SubtreeUpdate {
    const ids: string[] = [node.id]
    const nextChildren = node.children?.map((child) => {
        const result = applyShapeToSubtree(child, shape)
        ids.push(...result.ids)
        return result.node
    })
    return {
        node: {
            ...node,
            style: { ...node.style, shape },
            children: nextChildren,
        },
        ids,
    }
}

function updateTreeById(
    nodes: AnnotationNode[],
    targetId: string,
    updater: (node: AnnotationNode) => { node: AnnotationNode; payload: UpdatePayload },
): TreeUpdateResult {
    let payload: UpdatePayload | null = null

    function visit(node: AnnotationNode): AnnotationNode {
        if (payload) {
            return node
        }

        if (node.id === targetId) {
            const result = updater(node)
            payload = result.payload
            return result.node
        }

        if (node.children?.length) {
            let childChanged = false
            const nextChildren = node.children.map((child) => {
                const nextChild = visit(child)
                if (nextChild !== child) {
                    childChanged = true
                }
                return nextChild
            })

            if (childChanged) {
                return { ...node, children: nextChildren }
            }
        }

        return node
    }

    const nextNodes = nodes.map((node) => visit(node))
    return { nodes: nextNodes, payload }
}

function handleToggleVisibility(id: string) {
    const result = updateTreeById(props.annotations, id, (node) => {
        const visibility = !node.state.visibility
        const updated = applyVisibilityToSubtree(node, visibility)
        return { node: updated.node, payload: { ids: updated.ids, visibility } }
    })

    const payload = result.payload
    if (!payload) {
        return
    }

    emit('update:annotations', result.nodes)
    emit('change:visibility', {
        ids: payload.ids,
        visibility: payload.visibility ?? true,
    })
}

function handleChangeColor(id: string, color: string) {
    const result = updateTreeById(props.annotations, id, (node) => {
        const updated = applyColorToSubtree(node, color)
        return { node: updated.node, payload: { ids: updated.ids, color } }
    })

    const payload = result.payload
    if (!payload) {
        return
    }

    emit('update:annotations', result.nodes)
    emit('change:color', {
        ids: payload.ids,
        color: payload.color ?? color,
    })
}

function handleChangeShape(id: string, shape: AnnotationShape) {
    const result = updateTreeById(props.annotations, id, (node) => {
        const updated = applyShapeToSubtree(node, shape)
        return { node: updated.node, payload: { ids: updated.ids, shape } }
    })

    const payload = result.payload
    if (!payload) {
        return
    }

    emit('update:annotations', result.nodes)
    emit('change:shape', {
        ids: payload.ids,
        shape: payload.shape ?? shape,
    })
}
</script>

<template>
    <div class="annotations">
        <div class="annotations__header">
            <span class="annotations__title">Annotations</span>
        </div>

        <div class="annotations__panel">
            <div v-for="node in props.annotations" :key="node.id" class="annotations__column">
                <!-- @vue-generic {import('@/plotComponent/presentation/annotationsComponent/objectAnnotationData').AnnotationNode} -->
                <TreeView
                    :node="node"
                    :depth="0"
                    :ancestorHasNext="[]"
                    :isLast="true"
                    v-model:collapsedState="collapsedState">
                    <template #default="{ node: slotNode, hasChildren, isCollapsed, toggleCollapse }">
                        <AnnotationTreeNode
                            :node="slotNode"
                            :hasChildren="hasChildren"
                            :isCollapsed="isCollapsed"
                            :toggleCollapse="toggleCollapse"
                            @toggle-visibility="handleToggleVisibility"
                            @change-color="handleChangeColor"
                            @change-shape="handleChangeShape" />
                    </template>
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
    padding: 4px;
    background: var(--ui-panel-bg);
    border: 1px solid var(--ui-panel-border);
    color: var(--ui-text-primary);
    font-family: var(--ui-font);
}

.annotations__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 10px;
    border: 1px solid var(--ui-panel-border);
    background: var(--ui-panel-row-bg);
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: clamp(12px, 1.5vw, 14px);
    font-weight: 600;
}

.annotations__title {
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
    overflow: auto;
}

.annotations__column {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 0 0 260px;
    --tree-row-height: 18px;
    --tree-connector-bg: transparent;
    --tree-connector-border: transparent;
    min-width: 220px;
}

.annotations__empty {
    color: var(--ui-text-muted);
    font-size: 13px;
}
</style>
