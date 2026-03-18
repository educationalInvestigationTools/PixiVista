<script setup lang="ts">

import {computed, ref} from "vue";
import {fmtTime} from "@/lib/signal-visualizer/utils/utils.ts";

const props = defineProps<{
    windowStartSeconds: number
    windowLengthSeconds: number
    totalSeconds: number
}>()

const emit = defineEmits<{
    (e: 'update-value', value: number): void
}>()

let windowStartSeconds = ref(props.windowStartSeconds)
let sliderPositionSeconds = ref(windowStartSeconds.value)
let windowLengthSeconds = ref(Math.min(props.windowLengthSeconds, props.totalSeconds))

let windowEndSeconds = computed(
    () => Math.max(windowStartSeconds.value, props.totalSeconds - windowLengthSeconds.value)
)

function onSliderChange() {
    emit('update-value', sliderPositionSeconds.value)
}

</script>

<template>
    <div class="slider-container">
        <span class="slider-time-current"> {{ fmtTime(windowStartSeconds) }} </span>
        <input type='range'
               class="slider-time-range"
               :min="fmtTime(windowStartSeconds)"
               :max="windowEndSeconds"
               v-model.number="sliderPositionSeconds"
               step="1"
               @input="onSliderChange"
        />
        <span class="slider-time-end"> {{ fmtTime(windowEndSeconds) }} </span>
        <span> {{ fmtTime(sliderPositionSeconds) }} </span>
    </div>
</template>

<style scoped>

</style>
