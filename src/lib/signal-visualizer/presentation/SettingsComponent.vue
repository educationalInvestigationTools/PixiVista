<script setup lang="ts">

import { ref, watch } from "vue";

const props = defineProps<{
    windowLengthSeconds: number
    showMetrics: boolean
}>()

const windowLengthSeconds = ref(props.windowLengthSeconds)

const emit = defineEmits<{
    (e: "updateWindowLength", value: number): void
    (e: 'update:showMetrics', value: boolean): void
}>()

watch(
    () => windowLengthSeconds.value,
    () => emit('updateWindowLength', windowLengthSeconds.value)
)


function toggleShow() {
    emit('update:showMetrics', !props.showMetrics)
}

</script>

<template>
    <input type="range" :min="5" :max='10' step=1 v-model.number='windowLengthSeconds'>

    <span> {{ windowLengthSeconds }} </span>

    <input type="checkbox" :checked="showMetrics" @change="toggleShow">

</template>

<style scoped></style>
