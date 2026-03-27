<script setup lang="ts">

import {computed, ref, watch} from "vue";
import {fmtTime} from "@/lib/signal-visualizer/utils/utils.ts";

const props = defineProps<{
    windowStartSeconds: number
    windowLengthSeconds: number
    totalSeconds: number
}>()

const emit = defineEmits<{
    (e: 'updateValue', value: number): void
}>()

const windowStartSeconds = props.windowStartSeconds
const sliderPositionSeconds = ref(windowStartSeconds)
const windowLengthSeconds = computed(() => Math.min(props.windowLengthSeconds, props.totalSeconds))

const windowEndSeconds = computed(
    () => Math.max(windowStartSeconds, props.totalSeconds - windowLengthSeconds.value)
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
    <div class="border border-gray-900 rounded p-2">
        <span class="slider-time-current"> {{ fmtTime(windowStartSeconds) }} </span>
        <input type='range'
               class="slider-time-range"
               :min="fmtTime(windowStartSeconds)"
               :max="windowEndSeconds"
               v-model.number="sliderPositionSeconds"
               step="1"
        />
        <span class="slider-time-end"> {{ fmtTime(windowEndSeconds) }} </span>
        <span> {{ fmtTime(sliderPositionSeconds) }} </span>
    </div>
</template>

<style scoped>

</style>
