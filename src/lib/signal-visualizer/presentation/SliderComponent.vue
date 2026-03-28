<script setup lang="ts">
import {computed} from "vue";
import {fmtTime} from "@/lib/signal-visualizer/utils/utils.ts";

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
    return (raw / range) * 100
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


</script>
<template>
    <div class="border border-gray-900 rounded p-2 flex flex-row">
        <div class="left"
             :style="{ backgroundColor: 'lightblue', width: leftSliderPosition + '%', textAlign: 'right' }"> <span> {{
                fmtTime(0)
            }} </span></div>
        <div class="slider flex items-center justify-center"
             :style="{ backgroundColor: 'lightpink', width: (100 - leftSliderPosition - rightSliderPosition) + '%' }">
            <div class="relative w-full">
                <div class="absolute top-0 h-full bg-blue-400/40 pointer-events-none"
                     :style="{ width: highlightWindowWidth + '%', left: highlightWindowPosition + '%', }"></div>
                <div class="slider flex items-center justify-center w-full"
                     :style="{ backgroundColor: 'lightpink' }">
                    <input type="range" :min="0" :max="props.signalsLargestDuration"
                           v-model.number="viewPortStartSeconds" step="1" class="w-full"/>
                </div>
            </div>
        </div>
        <div class="right"
             :style="{ backgroundColor: 'lightgreen', width: rightSliderPosition + '%', 'word-break': 'break-word' }">
            <span> {{ fmtTime(props.signalsLargestDuration) }} </span>
        </div>
    </div>
</template>
<style scoped></style>
