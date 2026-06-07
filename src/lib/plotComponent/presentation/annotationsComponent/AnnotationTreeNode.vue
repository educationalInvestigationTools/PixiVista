<script setup lang="ts">
import type { AnnotationNode, ColorProperty, ShapeProperty } from '@/plotComponent/presentation/annotationsComponent/objectAnnotationData'

import ToggleVisibility from '@/plotComponent/presentation/annotationsComponent/PropertySelectors/ToggleVisibility.vue';
import ColorPicker from '@/plotComponent/presentation/annotationsComponent/PropertySelectors/ColorPicker.vue';
import ShapePicker from '@/plotComponent/presentation/annotationsComponent/PropertySelectors/ShapePicker.vue';

const props = defineProps<{
    node: AnnotationNode
}>()

</script>

<template>
    <div ref="rootRef" class="annotation-node" :class="{ 'annotation-node--off': !props.node.visibility.Value }">

        <ToggleVisibility :visibility="props.node.visibility.Value" @toggleVisibility="() => node.updateVisibility(!props.node.visibility.Value)">
        </ToggleVisibility>

        <div v-for="[propertyId, property] of props.node.getProperties()" :key="propertyId">
            <ColorPicker v-if="property.type === 'color'" :color="(property as ColorProperty).Value"
                :label="props.node.label" @changeColor="(color) => node.updateProperty(propertyId, color)">
            </ColorPicker>

            <ShapePicker v-if="property.type === 'shape'" :label="props.node.label" :shape="(property as ShapeProperty).Value"
                @changeShape="(shape) => props.node.updateProperty(propertyId, shape)"></ShapePicker>
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

.annotation-node__label {
    flex: 1;
    text-align: left;
    color: var(--ui-text-primary);
    font-size: inherit;
    word-break: break-word;
    font-family: inherit;
}
</style>
