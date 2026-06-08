<script setup lang="ts">
import type { AnnotationShape } from '@/presentation/annotationsComponent/objectAnnotationData';
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
    label: string
    shape: AnnotationShape
}>()

const emit = defineEmits<{
    (e: 'changeShape', shape: AnnotationShape): void
}>()

const showShapePicker = ref(false)
const shapePickerRef = ref<HTMLElement | null>(null)

function toggleShapePicker() {
    showShapePicker.value = !showShapePicker.value
}

function selectShape(shape: AnnotationShape) {
    emit('changeShape', shape)
    showShapePicker.value = false
}

function handleClickOutside(event: MouseEvent) {
    const target = event.target as Node

    if (
        shapePickerRef.value &&
        !shapePickerRef.value.contains(target)
    ) {
        showShapePicker.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

</script>
<template>
    <div ref="shapePickerRef" class="annotation-node__shape-picker">
        <button class="annotation-node__shape-button" type="button" @click.stop="toggleShapePicker"
            :title="'Pick shape for ' + props.label">
            <svg v-if="props.shape === 'rectangle'" class="annotation-node__shape" viewBox="0 0 16 10" fill="none"
                aria-hidden="true">
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
                    <line x1="1" y1="5" x2="15" y2="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                        stroke-dasharray="3 2" />
                </svg>
                <span>Dashed</span>
            </button>
        </div>
    </div>

</template>

<style scoped>
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
    min-width: 120px;
    z-index: 20;
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
</style>
