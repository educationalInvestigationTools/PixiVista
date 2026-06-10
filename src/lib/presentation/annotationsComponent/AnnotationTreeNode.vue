<script setup lang="ts">
import type { AnnotationNode, ColorProperty, ShapeProperty } from '@/presentation/annotationsComponent/objectAnnotationData'

import ToggleVisibility from '@/presentation/annotationsComponent/PropertySelectors/ToggleVisibility.vue';
import ColorPicker from '@/presentation/annotationsComponent/PropertySelectors/ColorPicker.vue';
import ShapePicker from '@/presentation/annotationsComponent/PropertySelectors/ShapePicker.vue';

const props = defineProps<{
    node: AnnotationNode
}>()

</script>

<template>
    <div ref="rootRef" class="annotation-node" :class="{ 'annotation-node--off': !props.node.visibility.Value }">

        <ToggleVisibility :visibility="props.node.visibility.Value"
            @toggleVisibility="() => node.updateVisibility(!props.node.visibility.Value)">
        </ToggleVisibility>

        <div class="annotation_property_selectors" v-for="[propertyId, property] of props.node.getProperties()"
            :key="propertyId">
            <ColorPicker v-if="property.type === 'color'" :color="(property as ColorProperty).Value"
                :label="props.node.label" @changeColor="(color) => node.updateProperty(propertyId, color)">
            </ColorPicker>

            <ShapePicker v-if="property.type === 'shape'" :label="props.node.label"
                :shape="(property as ShapeProperty).Value"
                @changeShape="(shape) => props.node.updateProperty(propertyId, shape)"></ShapePicker>
        </div>

        <span class="annotation-node__label">{{ props.node.label }}</span>
    </div>
</template>

<style scoped>
.annotation-node {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-sizing: border-box;
    padding: 3px 3px 0 0;

}

.annotation_property_selectors {
    display: flex;
    align-items: center;
    justify-content: center;
}

.annotation-node--off {
    opacity: 0.45;
}

.annotation-node--off .annotation-node__label {
    text-decoration: line-through;
}

.annotation-node__label {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--ui-text-primary);
    word-break: break-word;
}
</style>
