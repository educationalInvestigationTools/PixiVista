<script setup lang="ts">
import {computed, ref} from "vue";
import DialElement from "@/presentation/dialElement/DialElement.vue";
/*
This is in samples to ensure it's abstract, and does not know about the unit of measure of the client, thus to interact with it, should receive data in terms of samples, and the data it outputs should be mapped from samples to what the client understands. It needs a function that maps the sample values to what the client needs to see on the component.
*/

export type CurrentViewPortSamples = {
    currentSamplePosition: number,
    lengthSamples: number,
}

const props = defineProps<{
    leftSliderPositionPercent: number, // between 0 and 100
    rightSliderPositionPercent: number, // between 0 and 100
    viewPortLargestValueSamples: number,
    currentViewPort: CurrentViewPortSamples,
    sampleToString: ((arg0: number) => string),
    lengthToString: ((arg0: number) => string)
}>()

const emit = defineEmits<{
    (e: 'update:viewPort', value: CurrentViewPortSamples): void
}>()


const viewPortCurrentSample = computed({
    get: () => props.currentViewPort.currentSamplePosition,
    set: (v) => {
        emit('update:viewPort', {
            currentSamplePosition: v,
            lengthSamples: windowLengthSamples.value
        })
    }
})

const windowLengthSamples = computed({
    get: () => props.currentViewPort.lengthSamples,
    set: (v) => {
        emit('update:viewPort', {
            currentSamplePosition: viewPortCurrentSample.value,
            lengthSamples: v
        })
    }
})

const sliderPosition = computed(() => {
    const maxStart = Math.max(0, props.viewPortLargestValueSamples - windowLengthSamples.value)
    if (maxStart === 0) return 0

    const boundedStart = Math.max(0, Math.min(maxStart, viewPortCurrentSample.value))
    return (boundedStart / maxStart) * 100
})

const maxWindowLengthForDial = computed(() => {
    const available = Math.floor(props.viewPortLargestValueSamples - viewPortCurrentSample.value)
    return available
})

const windowLengthPercent = computed(() => { return (props.currentViewPort.lengthSamples / props.viewPortLargestValueSamples) * 100 })

const containerRef = ref<HTMLElement | null>(null)



function setSliderPositionFromPointer(pointerX: number) {
    const el = containerRef.value
    if (!el) return

    const rect = el.getBoundingClientRect()
    if (rect.width === 0) return

    const ratio = Math.max(0, Math.min(1, (pointerX - rect.left) / rect.width))
    const maxStart = Math.max(0, props.viewPortLargestValueSamples - windowLengthSamples.value)
    const nextStart = Math.round(ratio * maxStart)

    if (nextStart !== viewPortCurrentSample.value) {
        viewPortCurrentSample.value = nextStart
    }
}

function startSliderInteraction(e: PointerEvent) {
    (e.currentTarget as HTMLElement | null)?.focus()
    e.preventDefault()
    setSliderPositionFromPointer(e.clientX)
    document.body.style.userSelect = "none"

    function onMove(event: PointerEvent) {
        event.preventDefault()
        setSliderPositionFromPointer(event.clientX)
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
        const newVal = Math.max(0, viewPortCurrentSample.value - 1)
        if (newVal !== viewPortCurrentSample.value) viewPortCurrentSample.value = newVal
    }

    if (key === 'ArrowRight') {
        const maxStart = props.viewPortLargestValueSamples - windowLengthSamples.value
        const newVal = Math.min(maxStart, viewPortCurrentSample.value + 1)
        if (newVal !== viewPortCurrentSample.value) viewPortCurrentSample.value = newVal
    }

    if (key === 'ArrowUp') {
        const maxLength = maxWindowLengthForDial.value
        const newLen = Math.min(maxLength, windowLengthSamples.value + 1)
        if (newLen !== windowLengthSamples.value) windowLengthSamples.value = newLen
    }

    if (key === 'ArrowDown') {
        const newLen = Math.max(1, windowLengthSamples.value - 1)
        if (newLen !== windowLengthSamples.value) windowLengthSamples.value = newLen
    }
}

function fromPercentToSamples(percent: number) {
    return percent / 100 * props.viewPortLargestValueSamples
}

function updateWindowLength(percent: number) {
    windowLengthSamples.value = fromPercentToSamples(percent)
}

const thumbWidth = 5
const thumbPercent = (100 - thumbWidth) / 100

</script>
<template>
    <div class="slider">
        <div class="slider__row slider__row--info">
            <span class="slider__info slider__text">
                Current position: {{ props.sampleToString(viewPortCurrentSample) }}
            </span>
            <DialElement class="slider__info slider__dial" :current-value-percent="windowLengthPercent"
                :to-string-from-percent="(x) => 'Window Length is ' + props.lengthToString(fromPercentToSamples(x))"
                @update:value="updateWindowLength"> </DialElement>
        </div>

        <div class="slider__row slider__row--segment">
            <div class="slider__segment slider__segment--left"
                :style="{ flex: '0 0 ' + leftSliderPositionPercent + '%' }">
                <span class="slider__text">
                    {{ props.sampleToString(0) }}
                </span>
            </div>
            <div class="slider__segment slider__segment--middle" ref="containerRef"
                :style="{ flex: '0 0 ' + (rightSliderPositionPercent - leftSliderPositionPercent) + '%' }"
                @keydown="handleKeyDown" @pointerdown="startSliderInteraction" tabindex="0">

                <div class="slider__thumb"
                    :style="{ marginLeft: sliderPosition * thumbPercent + '%', width: thumbWidth + '%' }">
                </div>
            </div>
            <div class="slider__segment slider__segment--right"
                :style="{ flex: '0 0 ' + (100 - rightSliderPositionPercent) + '%' }">
                <span class="slider__text">
                    {{ props.sampleToString(props.viewPortLargestValueSamples) }}
                </span>
            </div>
        </div>
    </div>
</template>
<style scoped>
.slider {
    display: flex;
    flex-direction: column;
    border: 2px solid orange;
}

.slider__row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background-color: black;
        color: white;
}

.slider__row--info {
    gap: 10px;
    padding: 10px;
    flex-wrap: wrap;
}

.slider__segment {
    box-sizing: border-box;
    border: 1px solid orange;
    border-radius: 5px;
}

.slider__info {
    border: 1px solid orange;
    border-radius: 5px;
}

.slider__row--segment {
    justify-content: center;
    align-items: stretch;
}


.slider__segment--right {
    display: flex;
    justify-content: center;
    align-items: center;
}

.slider__segment--left {
    display: flex;
    justify-content: center;
    align-items: center;
}

.slider__thumb {
    aspect-ratio: 1;
    border-radius: 50%;
    background-color: #0044ffcf;
}

.slider__text {
    overflow-wrap: anywhere;
    text-align: center;
}
</style>
