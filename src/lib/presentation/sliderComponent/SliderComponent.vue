<script setup lang="ts">
import HeaderComponent from "@/presentation/sliderComponent/HeaderComponent.vue";
import type { CurrentViewPortSamples } from "@/presentation/sliderComponent/types";
import { computed, ref } from "vue";


const props = defineProps<{
    viewPortUpperBound: number,
    currentViewPort: CurrentViewPortSamples,
    sampleToString: ((arg0: number) => string),
    lengthToString: ((arg0: number) => string),
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

const windowLengthSamples = computed(() => props.currentViewPort.lengthSamples)

const sliderPosition = computed(() => {
    const maxStart = Math.max(0, props.viewPortUpperBound - windowLengthSamples.value)
    if (maxStart === 0) return 0

    const boundedStart = Math.max(0, Math.min(maxStart, viewPortCurrentSample.value))
    return (boundedStart / maxStart) * 100
})

const currentSliderRef = ref<HTMLElement | null>(null)

function setCurrentPositionFromPointer(pointerX: number) {
    const el = currentSliderRef.value
    if (!el) return

    const rect = el.getBoundingClientRect()
    if (rect.width === 0) return

    const ratio = Math.max(0, Math.min(1, (pointerX - rect.left) / rect.width))
    const maxStart = Math.max(0, props.viewPortUpperBound - windowLengthSamples.value)
    const nextStart = Math.round(ratio * maxStart)

    viewPortCurrentSample.value = nextStart
}

function startPointerDrag(e: PointerEvent, onPointerMove: (pointerX: number) => void) {
    onPointerMove(e.clientX)

    function onMove(event: PointerEvent) {
        onPointerMove(event.clientX)
    }

    function onUp() {
        window.removeEventListener("pointermove", onMove)
        window.removeEventListener("pointerup", onUp)
        window.removeEventListener("pointercancel", onUp)
    }


    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    window.addEventListener("pointercancel", onUp)
}

function startCurrentPositionInteraction(e: PointerEvent) {
    startPointerDrag(e, setCurrentPositionFromPointer)
}

const thumbWidth = 5
const thumbPercent = (100 - thumbWidth) / 100

</script>
<template>
    <div class="slider">
        <div class="slider__rows">
            <div class="slider__row slider__row--info">
                <HeaderComponent :headerText="'Start:'" :headerValue="props.sampleToString(0)">
                </HeaderComponent>

                <HeaderComponent :headerText="'End:'" :headerValue="props.sampleToString(props.viewPortUpperBound)">
                </HeaderComponent>

                <HeaderComponent :headerText="'Window Length:'" :headerValue="props.lengthToString(windowLengthSamples)">
                </HeaderComponent>

                <HeaderComponent :headerText="'Position:'" :headerValue="props.sampleToString(viewPortCurrentSample)">
                </HeaderComponent>
            </div>

            <div class="slider__row slider__row--slider">
                <div class="slider__track-area" ref="currentSliderRef" @pointerdown="startCurrentPositionInteraction"
                    tabindex="0">
                    <div class="slider__track"></div>
                    <div class="slider__thumb"
                        :style="{ marginLeft: sliderPosition * thumbPercent + '%', width: thumbWidth + '%' }">
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
.slider {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 4px;
    color: var(--ui-text-primary);
    background: var(--ui-panel-bg);
    border: 1px solid var(--ui-panel-border);
    font-family: var(--ui-font);
}

.slider__rows {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.slider__row {
    padding: 8px 10px;
    background: var(--ui-panel-row-bg);
    border: 1px solid var(--ui-panel-border);
    min-width: 0;
}

.slider__row--info {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    padding: 6px 4px;
    justify-content: space-between;
}

.slider__row--slider {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.slider__track-area {
    position: relative;
    display: flex;
    align-items: center;
    height: 40px;
    background: var(--ui-panel-surface);
    border: 1px solid var(--ui-panel-border);
    cursor: ew-resize;
    touch-action: none;
}

.slider__track-area:focus-visible {
    outline: 1px solid var(--ui-focus-color);
    outline-offset: 1px;
}

.slider__track {
    position: absolute;
    inset: 8px 10px;
        border: 1px solid var(--ui-panel-border);
    background: repeating-linear-gradient(90deg,
            var(--ui-track-grid-dark),
            var(--ui-track-grid-dark) 1px,
            var(--ui-track-grid-light) 1px,
            var(--ui-track-grid-light) 12px);
}

.slider__thumb {
    position: relative;
    height: 18px;
    border-radius: 2px;
    background: var(--ui-text-primary);
    border: 1px solid var(--ui-panel-border);
}

.slider__thumb::after {
    content: "";
    position: absolute;
    left: 50%;
    top: -6px;
    width: 2px;
    height: 30px;
    background: var(--ui-text-primary);
    transform: translateX(-50%);
}
</style>
