<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

import chevronDownIcon from '@assets/icons/chevron-down.svg'
import rectangleIcon from '@assets/icons/rectangle.svg'
import dashedLinesIcon from '@assets/icons/dashed-line.svg'
import type { AnnotationNode, AnnotationShape } from '@/plotComponent/presentation/annotationsComponent/objectAnnotationData'

defineOptions({ name: 'AnnotationTreeNode' })

const props = defineProps<{
    node: AnnotationNode
    depth: number
    collapsedState: Record<string, boolean>
    ancestorHasNext: boolean[]
    isLast: boolean
}>()

const emit = defineEmits<{
    (e: 'toggle-collapse', id: string): void
    (e: 'toggle-visibility', id: string): void
    (e: 'change-color', id: string, color: string): void
    (e: 'change-shape', id: string, shape: AnnotationShape): void
}>()

const hasChildren = computed(() => (props.node.children?.length ?? 0) > 0)
const isCollapsed = computed(() => !!props.collapsedState[props.node.id])
const showShapePicker = ref(false)
const treePrefix = computed(() => buildTreePrefix(props.ancestorHasNext, props.isLast))
const treePrefixWidth = computed(() => `${props.ancestorHasNext.length * 4}ch`)

function toggleCollapse() {
    if (hasChildren.value) {
        emit('toggle-collapse', props.node.id)
    }
}

function toggleVisibility() {
    emit('toggle-visibility', props.node.id)
}

function changeColor(event: Event) {
    const input = event.target as HTMLInputElement | null
    if (!input) return
    emit('change-color', props.node.id, input.value)
}

function toggleShapePicker() {
    showShapePicker.value = !showShapePicker.value
}

function selectShape(shape: AnnotationShape) {
    emit('change-shape', props.node.id, shape)
    showShapePicker.value = false
}

function buildTreePrefix(ancestorHasNext: boolean[], isLast: boolean) {
    if (ancestorHasNext.length === 0) {
        return ''
    }
    const prefix = ancestorHasNext
        .slice(0, -1)
        .map((hasNext) => (hasNext ? '│   ' : '    '))
        .join('')
    const branch = isLast ? '└── ' : '├── '
    return prefix + branch
}

function handleDocumentClick() {
    showShapePicker.value = false
}

watch(showShapePicker, (open) => {
    if (open) {
        document.addEventListener('click', handleDocumentClick)
    } else {
        document.removeEventListener('click', handleDocumentClick)
    }
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleDocumentClick)
})

function normalizeColor(color: string) {
    return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color) ? color : '#ffffff'
}
</script>

<template>
    <div class="annotation-node" :class="{ 'annotation-node--off': !props.node.state.visibility }">
        <span v-if="treePrefix" class="annotation-node__tree" :style="{ width: treePrefixWidth }">{{ treePrefix }}</span>
        <button class="annotation-node__collapse" type="button" :disabled="!hasChildren"
            :title="hasChildren ? (isCollapsed ? 'Expand' : 'Collapse') : 'No children'" @click="toggleCollapse">
            <img class="annotation-node__collapse-icon" :class="{ 'annotation-node__collapse-icon--collapsed': isCollapsed }"
                :src="chevronDownIcon" alt="" />
        </button>

        <button class="annotation-node__visibility" type="button" @click="toggleVisibility"
            :title="props.node.state.visibility ? 'Hide' : 'Show'" :aria-label="props.node.state.visibility ? 'Hide' : 'Show'">
            <svg v-if="props.node.state.visibility" class="annotation-node__visibility-icon" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                aria-hidden="true">
                <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
            <svg v-else class="annotation-node__visibility-icon" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                aria-hidden="true">
                <path d="M17.94 17.94A10.89 10.89 0 0 1 12 20c-6 0-10-8-10-8a21.35 21.35 0 0 1 5.06-6.94" />
                <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
                <path d="M1 1l22 22" />
                <path d="M14.12 14.12 9.88 9.88" />
                <path d="M7.5 7.5A10.86 10.86 0 0 1 12 4c6 0 10 8 10 8a21.38 21.38 0 0 1-3.22 4.47" />
            </svg>
        </button>

        <button class="annotation-node__color" type="button" :title="'Pick color for ' + props.node.label"
            :style="{ backgroundColor: props.node.style.color }">
            <input class="annotation-node__color-input" type="color" :value="normalizeColor(props.node.style.color)"
                :aria-label="'Pick color for ' + props.node.label" @input="changeColor" />
        </button>

        <div class="annotation-node__shape-picker">
            <button class="annotation-node__shape-button" type="button" @click.stop="toggleShapePicker"
                :title="'Pick shape for ' + props.node.label">
                <img class="annotation-node__shape"
                    :src="props.node.style.shape === 'rectangle' ? rectangleIcon : dashedLinesIcon" alt="" />
            </button>
            <div v-if="showShapePicker" class="annotation-node__shape-menu" @click.stop>
                <button class="annotation-node__shape-option" type="button" @click="selectShape('rectangle')">
                    <img class="annotation-node__shape-option-icon" :src="rectangleIcon" alt="" />
                    <span>Rectangle</span>
                </button>
                <button class="annotation-node__shape-option" type="button" @click="selectShape('dashed-lines')">
                    <img class="annotation-node__shape-option-icon" :src="dashedLinesIcon" alt="" />
                    <span>Dashed</span>
                </button>
            </div>
        </div>

        <span class="annotation-node__label">{{ props.node.label }}</span>
    </div>

    <div v-if="hasChildren && !isCollapsed" class="annotation-node__children">
        <AnnotationTreeNode v-for="(child, index) in props.node.children" :key="child.id" :node="child"
            :depth="props.depth + 1" :collapsedState="props.collapsedState"
            :ancestorHasNext="[...props.ancestorHasNext, !props.isLast]"
            :isLast="index === (props.node.children?.length ?? 0) - 1"
            @toggle-collapse="(id) => emit('toggle-collapse', id)"
            @toggle-visibility="(id) => emit('toggle-visibility', id)"
            @change-color="(id, color) => emit('change-color', id, color)"
            @change-shape="(id, shape) => emit('change-shape', id, shape)" />
    </div>
</template>

<style scoped>
.annotation-node {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0;
    font-size: clamp(12px, 1.4vw, 14px);
    line-height: 18px;
}

.annotation-node--off {
    opacity: 0.45;
}

.annotation-node--off .annotation-node__label {
    text-decoration: line-through;
}

.annotation-node__tree {
    color: #9a9a9a;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: 12px;
    white-space: pre;
    margin-right: 2px;
    line-height: 18px;
    display: inline-block;
}

.annotation-node__collapse {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
}

.annotation-node__collapse:disabled {
    cursor: default;
    opacity: 0.35;
}

.annotation-node__collapse-icon {
    width: 14px;
    height: 14px;
    transition: transform 0.15s ease;
    filter: brightness(0) invert(1);
}

.annotation-node__collapse-icon--collapsed {
    transform: rotate(-90deg);
}

.annotation-node__color {
    position: relative;
    width: 18px;
    height: 18px;
    border-radius: 3px;
    border: 1px solid #2a2a2a;
    padding: 0;
    background: transparent;
    cursor: pointer;
}

.annotation-node__color-input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
}

.annotation-node__shape-picker {
    position: relative;
}

.annotation-node__shape-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    padding: 0;
    border-radius: 2px;
    border: none;
    background: transparent;
    cursor: pointer;
}

.annotation-node__shape {
    width: 14px;
    height: 14px;
    filter: brightness(0) invert(1);
}

.annotation-node__shape-menu {
    position: absolute;
    top: 26px;
    left: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 6px;
    background: #0b0b0b;
    border: 1px solid #2a2a2a;
    z-index: 2;
    min-width: 120px;
}

.annotation-node__shape-option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 6px;
    border: 1px solid transparent;
    background: transparent;
    color: #ffffff;
    cursor: pointer;
    text-align: left;
}

.annotation-node__shape-option:hover {
    border-color: #2a2a2a;
    background: #101010;
}

.annotation-node__shape-option-icon {
    width: 14px;
    height: 14px;
    filter: brightness(0) invert(1);
}

.annotation-node__label {
    flex: 1;
    text-align: left;
    color: #ffffff;
    font-size: inherit;
    word-break: break-word;
    font-family: inherit;
}

.annotation-node__visibility {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    padding: 0;
    border: none;
    background: transparent;
    color: #9a9a9a;
    cursor: pointer;
}

.annotation-node__visibility-icon {
    width: 14px;
    height: 14px;
}

.annotation-node__children {
    display: flex;
    flex-direction: column;
    gap: 0;
    margin: 0;
    padding-left: 0;
    border-left: none;
}
</style>
