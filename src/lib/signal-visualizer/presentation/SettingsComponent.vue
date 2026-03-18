<script setup lang="ts">

import {ref, watch} from "vue";

const props = defineProps<{
    windowLengthSeconds: number
}>()

const windowLengthSeconds = ref(props.windowLengthSeconds)

const emit = defineEmits<{
    (e: "update-windowLength", value: number): void
}>()

watch(
    () => windowLengthSeconds.value,
    () => emit('update-windowLength', windowLengthSeconds.value)
)

</script>

<template>
    <input type="range"
           :min="5"
           :max='10'
           step=1
           v-model.number='windowLengthSeconds'>

    <span> {{ windowLengthSeconds }} </span>
</template>

<style scoped>

</style>
