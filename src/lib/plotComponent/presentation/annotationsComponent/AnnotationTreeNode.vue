<script setup lang="ts">
import type { AnnotationNode, AnnotationShape } from '@/plotComponent/presentation/annotationsComponent/objectAnnotationData'
import ColorPicker from '@/plotComponent/presentation/annotationsComponent/ColorPicker.vue';
import ShapePicker from '@/plotComponent/presentation/annotationsComponent/ShapePicker.vue';
import ToggleVisibility from '@/plotComponent/presentation/annotationsComponent/ToggleVisibility.vue';

const props = defineProps<{
    node: AnnotationNode
}>()

const emit = defineEmits<{
    (e: 'toggle-visibility', id: string): void
    (e: 'change-color', id: string, color: string): void
    (e: 'change-shape', id: string, shape: AnnotationShape): void
}>()

</script>

<template>
    <div ref="rootRef" class="annotation-node" :class="{ 'annotation-node--off': !props.node.state.visibility }">

        <ToggleVisibility :visibility="props.node.state.visibility" @toggleVisibility="() => emit('toggle-visibility', node.id)"></ToggleVisibility>

        <ColorPicker :color="props.node.style.color" :label="props.node.label"
            @changeColor="(color) => emit('change-color', props.node.id, color)"></ColorPicker>

        <ShapePicker :label="props.node.label" :shape="props.node.style.shape"
            @changeShape="(shape) => emit('change-shape', props.node.id, shape)"></ShapePicker>

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

.annotation-node__label {
    flex: 1;
    text-align: left;
    color: var(--ui-text-primary);
    font-size: inherit;
    word-break: break-word;
    font-family: inherit;
}


</style>
