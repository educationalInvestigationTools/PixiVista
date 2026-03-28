<script setup lang="ts">
import { computed, ref } from "vue";
import { fmtTime } from "@/lib/signal-visualizer/utils/utils.ts";

const props = defineProps<{
    leftSliderPosition: number,
    rightSliderPosition: number,
    viewPortStartSeconds: number,
    windowLengthSeconds: number,
    signalsLargestDuration: number
}>()

const emit = defineEmits<{
    (e: 'update:viewPortStartSeconds', value: number): void
    (e: 'update:windowLengthSeconds', value: number): void
}>()

const viewPortStartSeconds = computed({
    get: () => props.viewPortStartSeconds,
    set: (v) => {
        emit('update:viewPortStartSeconds', v)
    }
})

const windowLengthSeconds = computed({
    get: () => props.windowLengthSeconds,
    set: (v) => {
        emit('update:windowLengthSeconds', v)
    }
})

const highlightWindowWidth = computed(() => {
    const range = props.signalsLargestDuration
    const raw = Math.max(0, Math.min(
        range - viewPortStartSeconds.value,
        windowLengthSeconds.value
    ))
    const result = (raw / range) * 100
    return result
})
const highlightWindowPosition = computed(() => {
    const range = props.signalsLargestDuration
    let pos = ((viewPortStartSeconds.value) / range) * 100
    const maxLeft = 100 - highlightWindowWidth.value
    if (pos > maxLeft) pos = maxLeft
    if (pos < 0)
        pos = 0
    return pos
})

const containerRef = ref<HTMLElement | null>(null)

function startDrag(e: MouseEvent) {
    e.preventDefault()
    const startX = e.clientX
    const startValue = viewPortStartSeconds.value

    function onMove(ev: MouseEvent) {
        const dx = ev.clientX - startX
        const delta = pxToSeconds(dx)
        const newVal = Math.min(props.signalsLargestDuration - windowLengthSeconds.value, Math.max(0, startValue + delta))
        if (newVal != viewPortStartSeconds.value) {
            viewPortStartSeconds.value = newVal
        }
    }

    function onUp() {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
}

function pxToSeconds(px: number) {
    const el = containerRef.value
    if (!el) return 0

    const width = el.clientWidth
    const range = props.signalsLargestDuration

    if (width === 0 || range === 0) return 0
    return (px / width) * range
}


</script>
<template>
    <div class="border border-gray-900 rounded p-2 flex flex-row">
        <div class="left"
            :style="{ backgroundColor: 'lightblue', width: leftSliderPosition + '%', textAlign: 'right' }"> <span> {{
                fmtTime(0)
                }} </span></div>
        <div class="slider relative w-full flex items-center justify-center" ref="containerRef"
            :style="{ backgroundColor: 'lightpink', width: (100 - leftSliderPosition - rightSliderPosition) + '%' }">
            <div class="absolute top-0 h-full bg-blue-400/40 rounded cursor-grab active:cursor-grabbing"
                :style="{ width: highlightWindowWidth + '%', left: highlightWindowPosition + '%', }"
                @pointerdown="startDrag">
            </div>
        </div>
        <div class="right"
            :style="{ backgroundColor: 'lightgreen', width: rightSliderPosition + '%', 'word-break': 'break-word' }">
            <span> {{ fmtTime(props.signalsLargestDuration) }} </span>
        </div>
    </div>
</template>
<style scoped></style>
