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
    <div class="flex flex-col border border-gray-900 rounded p-2">
        <span> Settings panel: </span>
        <div>
            <span> Window Length Seconds </span>
            <input type="range" :min="5" :max='10' step=1 v-model.number='windowLengthSeconds'>
            <span> {{ windowLengthSeconds }} </span>

        </div>

        <div>
            <span> Show metrics panel </span>
            <input type="checkbox" :checked="showMetrics" @change="toggleShow">

        </div>

    </div>
</template>

<style scoped></style>
