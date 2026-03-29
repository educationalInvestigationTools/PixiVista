<script setup lang="ts">
import { computed, ref } from "vue";
import { fmtTime } from "@/lib/signal-visualizer/utils/utils.ts";

const props = defineProps<{
    leftSliderPositionPercent: number // between 0 and 100
    rightSliderPositionPercent: number, // between 0 and 100
    viewPortStartSeconds: number,
    windowLengthSeconds: number,
    viewPortLargestValueSeconds: number
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
    const range = props.viewPortLargestValueSeconds
    const raw = Math.max(0, Math.min(
        range - viewPortStartSeconds.value,
        windowLengthSeconds.value
    ))
    const result = (raw / range) * 100
    return result
})
const highlightWindowPosition = computed(() => {
    const range = props.viewPortLargestValueSeconds
    let pos = ((viewPortStartSeconds.value) / range) * 100
    const maxLeft = 100 - highlightWindowWidth.value
    if (pos > maxLeft) pos = maxLeft
    if (pos < 0)
        pos = 0
    return pos
})

const containerRef = ref<HTMLElement | null>(null)

function startDrag(e: MouseEvent) {
    const startX = e.clientX
    const currentPositionSeconds = viewPortStartSeconds.value
    const windowLength = windowLengthSeconds.value
    function onMove(ev: MouseEvent) {
        const dx = ev.clientX - startX
        const delta = pxToSeconds(dx)
        const newVal = Math.min(props.viewPortLargestValueSeconds - windowLength, Math.max(0, Math.round(currentPositionSeconds + delta)))
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

function startResize(orientation: 'left' | 'right', e: MouseEvent) {
    const startX = e.clientX
    const currentLengthSeconds = windowLengthSeconds.value
    const currentPositionSeconds = viewPortStartSeconds.value
    function onMove(ev: PointerEvent) {
        const dx = ev.clientX - startX
        const delta = pxToSeconds(dx)
        if (orientation === 'right') {
            let newLength = Math.round(currentLengthSeconds + delta)
            const maxLength = props.viewPortLargestValueSeconds - currentPositionSeconds
            newLength = Math.max(1, Math.min(maxLength, newLength))
            if (newLength !== windowLengthSeconds.value) {
                windowLengthSeconds.value = newLength
            }
        }
        if (orientation === 'left') {
            let newStart = currentPositionSeconds + delta
            newStart = Math.max(0, newStart)
            const rightEdge = currentPositionSeconds + currentLengthSeconds
            let newLength = Math.round(rightEdge - newStart)
            const maxLength = props.viewPortLargestValueSeconds - newStart
            newLength = Math.max(1, Math.min(maxLength, newLength))
            newStart = rightEdge - newLength
            if (
                newStart !== viewPortStartSeconds.value ||
                newLength !== windowLengthSeconds.value
            ) {
                viewPortStartSeconds.value = newStart
                windowLengthSeconds.value = newLength
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

function pxToSeconds(px: number) {
    const el = containerRef.value
    if (!el) return 0

    const width = el.clientWidth
    const range = props.viewPortLargestValueSeconds

    if (width === 0 || range === 0) return 0
    return (px / width) * range
}


</script>
<template>
    <div class="border border-slate-700 rounded p-2 flex flex-row bg-slate-900 text-slate-200">

        <!-- LEFT -->
        <div class="centered bg-slate-700" :style="{ width: leftSliderPositionPercent + '%', wordBreak: 'break-word' }">
            <span class="text-xs text-slate-300">
                {{ fmtTime(0) }}
            </span>
        </div>

        <!-- SLIDER -->
        <div class="relative bg-slate-800" ref="containerRef"
            :style="{ width: (100 - leftSliderPositionPercent - rightSliderPositionPercent) + '%' }">

            <div class="absolute top-0 left-0 h-full bg-blue-500/20 rounded cursor-grab active:cursor-grabbing hover:bg-blue-500/30 centered transition-colors"
                :style="{ width: highlightWindowWidth + '%', left: highlightWindowPosition + '%' }"
                @pointerdown="startDrag">
                <span class="pointer-events-none select-none text-xs font-medium text-blue-200">
                    {{ fmtTime(props.windowLengthSeconds) }}
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
                {{ fmtTime(props.viewPortLargestValueSeconds) }}
            </span>
        </div>

    </div>
</template>
<style scoped>
.centered {
    @apply flex items-center justify-center
}
</style>
