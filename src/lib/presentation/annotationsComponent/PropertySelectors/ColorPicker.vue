<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import Pickr from '@simonwep/pickr'

import type { Color } from '@/presentation/annotationsComponent/objectAnnotationData'

const props = defineProps<{
    color: Color
    label: string
}>()

const emit = defineEmits<{
    (e: 'changeColor', color: Color): void
}>()

const swatchRef = ref<HTMLElement | null>(null)

let pickr: Pickr | null = null

onMounted(() => {
    if (!swatchRef.value) return

    pickr = Pickr.create({
        el: swatchRef.value,
        theme: 'classic',

        default: props.color,
        useAsButton: true,

        components: {
            preview: true,
            opacity: false,
            hue: true,

            interaction: {
                input: true,
                save: true,
                cancel: true,
                clear: false,
            },
        },
    })

    pickr.on('save', (color: Pickr.HSVaColor) => {
        if (!color) return

        emit('changeColor', color.toHEXA().toString())
        pickr?.hide()
    })

    pickr.on('cancel', (color: Pickr.HSVaColor) => {
        if (!color) return
        pickr?.hide()
    })
})

watch(
    () => props.color,
    (newColor) => {
        if (!pickr) return
        pickr.setColor(newColor, true)
    }
)

onUnmounted(() => {
    pickr?.destroyAndRemove()
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
    box-sizing: content-box;
    display: inline-block;
    width: 18px;
    height: 18px;
    padding: 0;
    border-radius: 3px;
    border: 1px solid var(--ui-panel-border);
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
