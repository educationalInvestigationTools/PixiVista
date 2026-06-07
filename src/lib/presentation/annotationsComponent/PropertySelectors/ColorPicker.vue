<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import Picker from 'vanilla-picker'

import type { Color } from '@/presentation/annotationsComponent/objectAnnotationData'

const props = defineProps<{
    color: Color
    label: string
}>()

const emit = defineEmits<{
    (e: 'changeColor', color: Color): void
}>()

const swatchRef = ref<HTMLElement | null>(null)

let picker: Picker | null = null

onMounted(() => {
    if (!swatchRef.value) return

    picker = new Picker({
        parent: swatchRef.value,
        color: props.color
    })

    picker.onChange = (color) => {
        emit('changeColor', color.hex)
    }
})

watch(
    () => props.color,
    (newColor) => {
        picker?.setColor(newColor, false)
    }
)

onUnmounted(() => {
    picker?.destroy()
})
</script>

<template>
    <button ref="swatchRef" class="annotation-node__color" :title="'Pick color for ' + props.label">
        <span class="annotation-node__color-swatch" :style="{ backgroundColor: props.color }" />
    </button>
</template>

<style scoped>
.annotation-node__color {
    position: relative;
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 3px;
    border: 1px solid var(--ui-panel-border);
    padding: 0;
    background: var(--ui-panel-surface);
    cursor: pointer;
}

.annotation-node__color-swatch {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 2px;
}
</style>
