<script setup lang="ts">
import { computed, ref } from "vue";

import { ViewPort } from "@/lib/signal-visualizer/application/types/viewPort.ts";

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

const minWindowLengthSeconds = 1
const maxWindowLengthSeconds = 60

const viewPortStartSample = computed({
    get: () => props.viewPort.startSeconds,
    set: (v) => {
        emit('update:viewPort', new ViewPort(v, windowLength.value))
    }
})

const windowLength = computed({
    get: () => props.viewPort.lengthSeconds,
    set: (v) => {
        emit('update:viewPort', new ViewPort(viewPortStartSample.value, v))
    }
})

const circlePosition = computed(() => {
    const maxStart = Math.max(0, props.viewPortLargestValueSamples - windowLength.value)
    if (maxStart === 0) return 0

    const boundedStart = Math.max(0, Math.min(maxStart, viewPortStartSample.value))
    return (boundedStart / maxStart) * 100
})

const maxWindowLengthForDial = computed(() => {
    const available = Math.floor(props.viewPortLargestValueSamples - viewPortStartSample.value)
    return Math.max(minWindowLengthSeconds, Math.min(maxWindowLengthSeconds, available))
})

const windowLengthDialStyle = computed<Record<string, string>>(() => {
    const maxLength = maxWindowLengthForDial.value
    if (maxLength <= minWindowLengthSeconds) {
        return { '--dial-fill': '100%' }
    }

    const boundedLength = Math.max(minWindowLengthSeconds, Math.min(maxLength, windowLength.value))
    const fill = ((boundedLength - minWindowLengthSeconds) / (maxLength - minWindowLengthSeconds)) * 100
    return { '--dial-fill': `${fill}%` }
})

const containerRef = ref<HTMLElement | null>(null)

function updateWindowLength(nextLength: number) {
    const maxLength = maxWindowLengthForDial.value
    const bounded = Math.max(minWindowLengthSeconds, Math.min(maxLength, Math.round(nextLength)))
    if (bounded !== windowLength.value) {
        windowLength.value = bounded
    }
}

function getDialPercentFromPointer(event: PointerEvent, dialElement: HTMLElement) {
    const dialRect = dialElement.getBoundingClientRect()
    const centerX = dialRect.left + dialRect.width / 2
    const centerY = dialRect.top + dialRect.height / 2
    const deltaX = event.clientX - centerX
    const deltaY = event.clientY - centerY
    const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI
    const normalizedAngle = (angle + 450) % 360
    return (normalizedAngle / 360) * 100
}

function applyWindowLengthDialPointer(event: PointerEvent, dialElement: HTMLElement) {
    const maxLength = maxWindowLengthForDial.value
    if (maxLength <= minWindowLengthSeconds) {
        updateWindowLength(minWindowLengthSeconds)
        return
    }

    const pointerPercent = getDialPercentFromPointer(event, dialElement)
    const nextLength = minWindowLengthSeconds
        + ((maxLength - minWindowLengthSeconds) * Math.max(0, Math.min(100, pointerPercent))) / 100
    updateWindowLength(nextLength)
}

function startWindowLengthDialInteraction(event: PointerEvent) {
    event.preventDefault()
    const dialElement = event.currentTarget as HTMLElement
    applyWindowLengthDialPointer(event, dialElement)
    document.body.style.userSelect = 'none'

    function onMove(moveEvent: PointerEvent) {
        moveEvent.preventDefault()
        applyWindowLengthDialPointer(moveEvent, dialElement)
    }

    function onUp() {
        document.body.style.userSelect = ''
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        window.removeEventListener('pointercancel', onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
}

function nudgeWindowLength(direction: -1 | 1) {
    updateWindowLength(windowLength.value + direction)
}

function setCirclePositionFromPointer(pointerX: number) {
    const el = containerRef.value
    if (!el) return

    const rect = el.getBoundingClientRect()
    if (rect.width === 0) return

    const ratio = Math.max(0, Math.min(1, (pointerX - rect.left) / rect.width))
    const maxStart = Math.max(0, props.viewPortLargestValueSamples - windowLength.value)
    const nextStart = Math.round(ratio * maxStart)

    if (nextStart !== viewPortStartSample.value) {
        viewPortStartSample.value = nextStart
    }
}

function startSliderInteraction(e: PointerEvent) {
    (e.currentTarget as HTMLElement | null)?.focus()
    e.preventDefault()
    setCirclePositionFromPointer(e.clientX)
    document.body.style.userSelect = "none"

    function onMove(event: PointerEvent) {
        event.preventDefault()
        setCirclePositionFromPointer(event.clientX)
    }

    function onUp() {
        document.body.style.userSelect = ""
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerup", onUp)
        window.removeEventListener("pointercancel", onUp)
    }

    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    window.addEventListener("pointercancel", onUp)
}

function handleKeyDown(e: KeyboardEvent) {
    const key = e.key
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) return
    e.preventDefault()

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
        const maxLength = maxWindowLengthForDial.value
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
    <div class="border border-slate-700 rounded p-2 flex flex-col gap-2 bg-black text-slate-200">

        <div class="slider-info-row">
            <span class="text-sm text-slate-300">
                Current position: {{ props.sampleToString(viewPortStartSample) }}
            </span>

            <div class="slider-info-row__window-length">
                <span class="text-sm text-slate-300">
                    Window length: {{ windowLength }}s
                </span>

                <button class="window-length-dial" type="button" role="slider" :aria-valuemin="minWindowLengthSeconds"
                    :aria-valuemax="maxWindowLengthForDial" :aria-valuenow="windowLength"
                    aria-label="Window length in seconds" :style="windowLengthDialStyle"
                    @pointerdown="startWindowLengthDialInteraction" @keydown.left.prevent="nudgeWindowLength(-1)"
                    @keydown.down.prevent="nudgeWindowLength(-1)" @keydown.right.prevent="nudgeWindowLength(1)"
                    @keydown.up.prevent="nudgeWindowLength(1)">
                    <span class="window-length-dial__inner" aria-hidden="true"></span>
                </button>
            </div>
        </div>

        <div class="flex flex-row">

            <!-- LEFT -->
            <div class="centered bg-slate-700"
                :style="{ width: leftSliderPositionPercent + '%', wordBreak: 'break-word' }">
                <span class="text-sm text-slate-300">
                    {{ props.sampleToString(0) }}
                </span>
            </div>

            <!-- SLIDER -->
            <div class="relative bg-slate-800 " ref="containerRef" tabindex="0"
                :style="{ width: (100 - leftSliderPositionPercent - rightSliderPositionPercent) + '%' }"
                @keydown="handleKeyDown" @pointerdown="startSliderInteraction">

                <div class="absolute top-1/2 left-0 w-full h-0.5 -translate-y-1/2 bg-slate-600"></div>

                <div class="slider-circle" :style="{ left: circlePosition + '%' }" aria-hidden="true">
                </div>
            </div>

            <!-- RIGHT -->
            <div class="centered bg-slate-700"
                :style="{ width: rightSliderPositionPercent + '%', wordBreak: 'break-word' }">
                <span class="text-sm text-slate-300">
                    {{ props.sampleToString(props.viewPortLargestValueSamples) }}
                </span>
            </div>

        </div>
    </div>
</template>
<style scoped>
@layer components {
    .centered {
        display: flex;
        align-items: center;
        justify-content: center;
    }
.slider-circle {
    position: absolute;
    top: 50%;
    width: 14px;
    height: 14px;
    border-radius: 999px;
    transform: translate(-50%, -50%);
    background: #38bdf8;
    border: 2px solid #0f172a;
    pointer-events: none;
}

.slider-info-row {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
    align-self: flex-start;
    border: 1px solid #334155;
    border-radius: 8px;
    background: #020617;
    padding: 8px 10px;
}

.slider-info-row__window-length {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.window-length-dial {
    --dial-fill: 0%;
    appearance: none;
    -webkit-appearance: none;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    min-width: 30px;
    aspect-ratio: 1 / 1;
    padding: 0;
    border: 1px solid #475569;
    border-radius: 50%;
    overflow: hidden;
    clip-path: circle(50% at 50% 50%);
    isolation: isolate;
    cursor: pointer;
    user-select: none;
    touch-action: none;
    background: #0f172a;
    transition: border-color 0.2s;
}

.window-length-dial::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: conic-gradient(#38bdf8 var(--dial-fill), rgba(56, 189, 248, 0.2) var(--dial-fill));
}

.window-length-dial::after {
    content: '';
    position: absolute;
    inset: 6px;
    border-radius: 50%;
    background: #0f172a;
}

.window-length-dial:hover {
    border-color: #7dd3fc;
}

.window-length-dial:focus-visible {
    outline: 2px solid #38bdf8;
    outline-offset: 1px;
}

.window-length-dial__inner {
    position: relative;
    z-index: 1;
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: #e0f2fe;
    box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.35);
}
}
</style>
