<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { fmtTime } from "@/lib/signal-visualizer/utils/utils.ts";
const props = defineProps<{
    leftSliderPosition: number,
    rightSliderPosition: number,
    signalsStartSeconds: number,
    windowLengthSeconds: number,
    signalsLargestDuration: number
}>()

const emit = defineEmits<{
    (e: 'updateValue', value: number): void
}>()
const windowStartSeconds = computed(() => props.signalsStartSeconds)
const windowEndSeconds = computed(() => props.signalsLargestDuration)
const sliderPositionSeconds = ref(windowStartSeconds.value)
const windowLengthSeconds = computed(() => Math.min(props.windowLengthSeconds, props.signalsLargestDuration))
watch(() => sliderPositionSeconds.value,
    (val, oldVal) => {
        if (val != oldVal) {
            emit('updateValue', sliderPositionSeconds.value)
        }
    })
watch(
    () => props.windowLengthSeconds,
    () => {
        sliderPositionSeconds.value = windowStartSeconds.value

    })
const highlightWindowWidth = computed(() => {
    const range = windowEndSeconds.value - windowStartSeconds.value
    if (range <= 0) return 0
    const raw = Math.min(windowEndSeconds.value - sliderPositionSeconds.value, windowLengthSeconds.value)
    return (raw / range) * 100
})
const highlightWindowPosition = computed(() => {
    const range = windowEndSeconds.value - windowStartSeconds.value
    if (range <= 0)
        return 0
    let pos = ((sliderPositionSeconds.value - windowStartSeconds.value) / range) * 100
    const maxLeft = 100 - highlightWindowWidth.value
    if (pos > maxLeft) pos = maxLeft
    if (pos < 0)
        pos = 0
    return pos
})
</script>
<template>
    <div class="border border-gray-900 rounded p-2 flex flex-row">
        <div class="left"
            :style="{ backgroundColor: 'lightblue', width: leftSliderPosition + '%', textAlign: 'right' }"> <span> {{
                fmtTime(windowStartSeconds) }} </span> </div>
        <div class="slider flex items-center justify-center"
            :style="{ backgroundColor: 'lightpink', width: (100 - leftSliderPosition - rightSliderPosition) + '%' }">
            <div class="relative w-full">
                <div class="absolute top-0 h-full bg-blue-400/40 pointer-events-none"
                    :style="{ width: highlightWindowWidth + '%', left: highlightWindowPosition + '%', }"> </div>
                <div class="slider flex items-center justify-center w-full" :style="{ backgroundColor: 'lightpink' }">
                    <input type="range" :min="windowStartSeconds" :max="windowEndSeconds"
                        v-model.number="sliderPositionSeconds" step="1" class="w-full" />
                </div>
            </div>
        </div>
        <div class="right"
            :style="{ backgroundColor: 'lightgreen', width: rightSliderPosition + '%', 'word-break': 'break-word' }">
            <span> {{ fmtTime(windowEndSeconds) }} </span>
        </div>
    </div>
</template>
<style scoped></style>
