<script setup lang="ts">

import { computed, ref, watch } from "vue";
import { fmtTime } from "@/lib/signal-visualizer/utils/utils.ts";

const props = defineProps<{
    leftSliderPosition: number,
    rightSliderPosition: number,
    signalsStartSeconds: number
    windowLengthSeconds: number
    signalsLargestDuration: number
}>()

const emit = defineEmits<{
    (e: 'updateValue', value: number): void
}>()


const windowStartSeconds = props.signalsStartSeconds
const sliderPositionSeconds = ref(windowStartSeconds)
const windowLengthSeconds = computed(() => Math.min(props.windowLengthSeconds, props.signalsLargestDuration))

const windowEndSeconds = computed(
    () => Math.max(windowStartSeconds, props.signalsLargestDuration)
)

watch(
    () => sliderPositionSeconds.value,
    () => emit('updateValue', sliderPositionSeconds.value)
)

watch(
    () => props.windowLengthSeconds,
    () => {
        sliderPositionSeconds.value = windowStartSeconds
    }
)

</script>

<template>
    <div class="border border-gray-900 rounded p-2 flex flex-row">
        <div class="left"
            :style="{ backgroundColor: 'lightblue', width: leftSliderPosition + '%', textAlign: 'right' }">
            <span> {{ fmtTime(windowStartSeconds) }} </span>
        </div>
        <div class="slider flex items-center justify-center"
            :style="{ backgroundColor: 'lightpink', width: (100 - leftSliderPosition - rightSliderPosition) + '%' }">
            <input type='range' class="slider-time-range" :min="windowStartSeconds" :max="windowEndSeconds"
                v-model.number="sliderPositionSeconds" step="1" :style="{ width: '100%' }" />
        </div>
        <div class="right"
            :style="{ backgroundColor: 'lightgreen', width: rightSliderPosition + '%', 'word-break': 'break-word' }">
            <span> {{ fmtTime(windowEndSeconds) }} </span>
        </div>
    </div>
</template>

<style scoped></style>
