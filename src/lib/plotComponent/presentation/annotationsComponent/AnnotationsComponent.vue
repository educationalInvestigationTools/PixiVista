<script setup lang="ts">

import AnnotationTreeNode from '@/plotComponent/presentation/annotationsComponent/AnnotationTreeNode.vue'
import TreeView from '@/presentation/tree/TreeView.vue'
import type {
    AnnotationColorChange,
    AnnotationNode,
    AnnotationShape,
    AnnotationShapeChange,
    AnnotationVisibilityChange,
    Color,
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
    annotations: AnnotationNode[]
}>()

const emit = defineEmits<{
    (e: 'update:annotations', value: AnnotationNode[]): void
    (e: 'change:visibility', value: AnnotationVisibilityChange): void
    (e: 'change:color', value: AnnotationColorChange): void
    (e: 'change:shape', value: AnnotationShapeChange): void
}>()

function applyVisibilityToSubtree(node: AnnotationNode, visibility: boolean): SubtreeUpdate {
    const ids: string[] = [node.id]
    const nextChildren = node.children.map((child) => {
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

function applyColorToSubtree(node: AnnotationNode, color: Color): SubtreeUpdate {
    const ids: string[] = [node.id]
    const nextChildren = node.children.map((child) => {
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
    const nextChildren = node.children.map((child) => {
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

        if (node.children.length) {
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

function handleChangeColor(id: string, color: Color) {
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
        <span class="annotations__heading">Annotations</span>

        <div class="annotations__panel">
            <div v-for="node in props.annotations" :key="node.id" class="annotations__column">
                <TreeView :node="node" v-slot="{ node: slotNode }">
                    <AnnotationTreeNode :node="slotNode" @toggle-visibility="handleToggleVisibility"
                        @change-color="handleChangeColor" @change-shape="handleChangeShape" />
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
    overflow: auto;
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
