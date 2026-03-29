<script setup lang="ts">
import { computed, ref } from "vue";
import { ViewPort } from "../application/signalSource";

/*
This is in samples to ensure it's abstract, and does not know about the unit of measure of the client, thus to interact with it, should receive data in terms of samples, and the data it outputs should be mapped from samples to what the client understands. It needs a function that maps the sample values to what the client needs to see on the component.
*/

const props = defineProps<{
    leftSliderPositionPercent: number // between 0 and 100
    rightSliderPositionPercent: number, // between 0 and 100
    viewPort: ViewPort,
    viewPortLargestValueSamples: number
    sampleToString: ((arg0: number) => string)
}>()

const emit = defineEmits<{
    (e: 'update:viewPort', value: ViewPort): void
}>()

const viewPortStartSample = computed({
    get: () => props.viewPort.startSeconds,
    set: (v) => {
        emit('update:viewPort', new ViewPort(v, windowLength.value)

        )
    }
})

const windowLength = computed({
    get: () => props.viewPort.lengthSeconds,
    set: (v) => {
        emit('update:viewPort', new ViewPort(viewPortStartSample.value, v))
    }
})

const highlightWindowWidth = computed(() => {
    const range = props.viewPortLargestValueSamples
    const raw = Math.max(0, Math.min(
        range - viewPortStartSample.value,
        windowLength.value
    ))
    const result = (raw / range) * 100
    return result
})
const highlightWindowPosition = computed(() => {
    const range = props.viewPortLargestValueSamples
    let pos = ((viewPortStartSample.value) / range) * 100
    const maxLeft = 100 - highlightWindowWidth.value
    if (pos > maxLeft) pos = maxLeft
    if (pos < 0)
        pos = 0
    return pos
})

const containerRef = ref<HTMLElement | null>(null)

function startDrag(e: MouseEvent) {
    const startX = e.clientX
    const currentPosition = viewPortStartSample.value
    const currentWindowLength = windowLength.value
    function onMove(ev: MouseEvent) {
        const dx = ev.clientX - startX
        const delta = pxToSamples(dx)
        const newVal = Math.min(props.viewPortLargestValueSamples - currentWindowLength, Math.max(0, Math.round(currentPosition + delta)))
        if (newVal != viewPortStartSample.value) {
            viewPortStartSample.value = newVal
        }
    }

    function onUp() {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
}

function startResize(orientation: 'left' | 'right', e: MouseEvent) {
    const startX = e.clientX
    const currentLength = windowLength.value
    const currentPosition = viewPortStartSample.value
    function onMove(ev: PointerEvent) {
        const dx = ev.clientX - startX
        const delta = pxToSamples(dx)
        if (orientation === 'right') {
            let newLength = Math.round(currentLength + delta)
            const maxLength = props.viewPortLargestValueSamples - currentPosition
            newLength = Math.max(1, Math.min(maxLength, newLength))
            if (newLength !== windowLength.value) {
                windowLength.value = newLength
            }
        }
        if (orientation === 'left') {
            let newStart = currentPosition + delta
            newStart = Math.max(0, newStart)
            const rightEdge = currentPosition + currentLength
            let newLength = Math.round(rightEdge - newStart)
            const maxLength = props.viewPortLargestValueSamples - newStart
            newLength = Math.max(1, Math.min(maxLength, newLength))
            newStart = rightEdge - newLength
            if (
                newStart !== viewPortStartSample.value ||
                newLength !== windowLength.value
            ) {
                viewPortStartSample.value = newStart
                windowLength.value = newLength
            }
        }
    }
    function onUp() {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
}

function startResizeRight(e: MouseEvent) {
    startResize('right', e)
}

function startResizeLeft(e: MouseEvent) {
    startResize('left', e)
}

function pxToSamples(px: number) {
    const el = containerRef.value
    if (!el) return 0

    const width = el.clientWidth
    const range = props.viewPortLargestValueSamples

    if (width === 0 || range === 0) return 0
    return (px / width) * range
}

function handleKeyDown(e: KeyboardEvent) {
    e.preventDefault()
    const key = e.key
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) return

    if (key === 'ArrowLeft') {
        const newVal = Math.max(0, viewPortStartSample.value - 1)
        if (newVal !== viewPortStartSample.value) viewPortStartSample.value = newVal
    }

    if (key === 'ArrowRight') {
        const maxStart = props.viewPortLargestValueSamples - windowLength.value
        const newVal = Math.min(maxStart, viewPortStartSample.value + 1)
        if (newVal !== viewPortStartSample.value) viewPortStartSample.value = newVal
    }

    if (key === 'ArrowUp') {
        const maxLength = props.viewPortLargestValueSamples - viewPortStartSample.value
        const newLen = Math.min(maxLength, windowLength.value + 1)
        if (newLen !== windowLength.value) windowLength.value = newLen
    }

    if (key === 'ArrowDown') {
        const newLen = Math.max(1, windowLength.value - 1)
        if (newLen !== windowLength.value) windowLength.value = newLen
    }
}


</script>
<template>
    <div class="border border-slate-700 rounded p-2 flex flex-row bg-slate-900 text-slate-200">

        <!-- LEFT -->
        <div class="centered bg-slate-700" :style="{ width: leftSliderPositionPercent + '%', wordBreak: 'break-word' }">
            <span class="text-xs text-slate-300">
                {{ props.sampleToString(0) }}
            </span>
        </div>

        <!-- SLIDER -->
        <div class="relative bg-slate-800 " ref="containerRef" tabindex="0"
            :style="{ width: (100 - leftSliderPositionPercent - rightSliderPositionPercent) + '%' }"
            @keydown="handleKeyDown">

            <div class="absolute top-0 left-0 h-full bg-blue-500/20 rounded cursor-grab active:cursor-grabbing hover:bg-blue-500/30 centered transition-colors"
                :style="{ width: highlightWindowWidth + '%', left: highlightWindowPosition + '%' }"
                @pointerdown="startDrag">
                <span class="pointer-events-none select-none text-xs font-medium text-blue-200">
                    {{ props.sampleToString(props.viewPort.lengthSeconds) }}
                </span>

                <!-- LEFT HANDLE -->
                <div class="absolute left-0 top-0 h-full w-3 hover:w-4 transition-all bg-blue-500 cursor-ew-resize"
                    @pointerdown.stop="startResizeLeft">
                </div>

                <!-- RIGHT HANDLE -->
                <div class="absolute right-0 top-0 h-full w-3 hover:w-4 transition-all bg-blue-500 cursor-ew-resize"
                    @pointerdown.stop="startResizeRight">
                </div>
            </div>
        </div>

        <!-- RIGHT -->
        <div class="centered bg-slate-700"
            :style="{ width: rightSliderPositionPercent + '%', wordBreak: 'break-word' }">
            <span class="text-xs text-slate-300">
                {{ props.sampleToString(props.viewPortLargestValueSamples) }}
            </span>
        </div>

    </div>
</template>
<style scoped>
.centered {
    @apply flex items-center justify-center
}
</style>
