<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { AnnotationNode, AnnotationShape } from '@/plotComponent/presentation/annotationsComponent/objectAnnotationData'
import ColorPicker from '@/plotComponent/presentation/annotationsComponent/ColorPicker.vue';

defineOptions({ name: 'AnnotationTreeNode' })

const props = defineProps<{
    node: AnnotationNode
}>()

const emit = defineEmits<{
    (e: 'toggle-visibility', id: string): void
    (e: 'change-color', id: string, color: string): void
    (e: 'change-shape', id: string, shape: AnnotationShape): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const showShapePicker = ref(false)

function toggleVisibility() {
    emit('toggle-visibility', props.node.id)
}

function toggleShapePicker() {
    showShapePicker.value = !showShapePicker.value
}

function selectShape(shape: AnnotationShape) {
    emit('change-shape', props.node.id, shape)
    showShapePicker.value = false
}

function handleDocumentPointerDown(event: PointerEvent) {
    if (!showShapePicker.value) {
        return
    }

    const target = event.target as Node | null
    const rootEl = rootRef.value
    if (rootEl && target && !rootEl.contains(target)) {
        showShapePicker.value = false
    }
}

onMounted(() => {
    document.addEventListener('pointerdown', handleDocumentPointerDown)
})

onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handleDocumentPointerDown)
})


</script>

<template>
    <div ref="rootRef" class="annotation-node" :class="{ 'annotation-node--off': !props.node.state.visibility }">
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

        <ColorPicker :color="props.node.style.color" :label="props.node.label" @changeColor="(color) => emit('change-color', props.node.id, color)"></ColorPicker>

        <div class="annotation-node__shape-picker">
            <button class="annotation-node__shape-button" type="button" @click.stop="toggleShapePicker"
                :title="'Pick shape for ' + props.node.label">
                <svg v-if="props.node.style.shape === 'rectangle'" class="annotation-node__shape" viewBox="0 0 16 10"
                    fill="none" aria-hidden="true">
                    <rect x="1.25" y="1.25" width="13.5" height="7.5" stroke="currentColor" stroke-width="1.5" />
                </svg>
                <svg v-else class="annotation-node__shape" viewBox="0 0 16 10" fill="none" aria-hidden="true">
                    <line x1="1" y1="5" x2="15" y2="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                        stroke-dasharray="3 2" />
                </svg>
            </button>
            <div v-if="showShapePicker" class="annotation-node__shape-menu" @click.stop>
                <button class="annotation-node__shape-option" type="button" @click="selectShape('rectangle')">
                    <svg class="annotation-node__shape-option-icon" viewBox="0 0 16 10" fill="none" aria-hidden="true">
                        <rect x="1.25" y="1.25" width="13.5" height="7.5" stroke="currentColor" stroke-width="1.5" />
                    </svg>
                    <span>Rectangle</span>
                </button>
                <button class="annotation-node__shape-option" type="button" @click="selectShape('dashed-lines')">
                    <svg class="annotation-node__shape-option-icon" viewBox="0 0 16 10" fill="none" aria-hidden="true">
                        <line x1="1" y1="5" x2="15" y2="5" stroke="currentColor" stroke-width="1.5"
                            stroke-linecap="round" stroke-dasharray="3 2" />
                    </svg>
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
    color: var(--ui-text-primary);
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
    color: var(--ui-text-primary);
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
