<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'

import rectangleIcon from '@assets/icons/rectangle.svg'
import dashedLinesIcon from '@assets/icons/dashed-line.svg'
import type { AnnotationNode, AnnotationShape } from '@/plotComponent/presentation/annotationsComponent/objectAnnotationData'

defineOptions({ name: 'AnnotationTreeNode' })

const props = defineProps<{
    node: AnnotationNode
    hasChildren: boolean
    isCollapsed: boolean
    toggleCollapse: () => void
}>()

const emit = defineEmits<{
    (e: 'toggle-visibility', id: string): void
    (e: 'change-color', id: string, color: string): void
    (e: 'change-shape', id: string, shape: AnnotationShape): void
}>()

const showShapePicker = ref(false)

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
        <button class="annotation-node__visibility" type="button" @click="toggleVisibility"
            :title="props.node.state.visibility ? 'Hide' : 'Show'"
            :aria-label="props.node.state.visibility ? 'Hide' : 'Show'">
            <svg v-if="props.node.state.visibility" class="annotation-node__visibility-icon" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                aria-hidden="true">
                <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
            <svg v-else class="annotation-node__visibility-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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
</template>

<style scoped>
.annotation-node {
    display: flex;
    align-items: center;
    gap: 8px;
}

.annotation-node--off {
    opacity: 0.45;
}

.annotation-node--off .annotation-node__label {
    text-decoration: line-through;
}

.annotation-node__color {
    position: relative;
    width: 18px;
    height: 18px;
    border-radius: 3px;
    border: 1px solid var(--ui-panel-border);
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
    filter: var(--ui-icon-filter);
}

.annotation-node__shape-menu {
    position: absolute;
    top: 26px;
    left: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 6px;
    background: var(--ui-panel-row-bg);
    border: 1px solid var(--ui-panel-border);
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
    color: var(--ui-text-primary);
    cursor: pointer;
    text-align: left;
}

.annotation-node__shape-option:hover {
    border-color: var(--ui-panel-border);
    background: var(--ui-hover-bg);
}

.annotation-node__shape-option-icon {
    width: 14px;
    height: 14px;
    filter: var(--ui-icon-filter);
}

.annotation-node__label {
    flex: 1;
    text-align: left;
    color: var(--ui-text-primary);
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
    color: var(--ui-text-muted);
    cursor: pointer;
}

.annotation-node__visibility-icon {
    width: 14px;
    height: 14px;
}
</style>
