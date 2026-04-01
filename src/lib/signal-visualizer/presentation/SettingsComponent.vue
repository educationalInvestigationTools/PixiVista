<script setup lang="ts">
import { ref } from 'vue';


const props = defineProps<{
    showMetrics: boolean
    showAnnotations: boolean
    heightPerChannel: number
}>()


const emit = defineEmits<{
    (e: 'update:showMetrics', value: boolean): void
    (e: 'update:showAnnotations', value: boolean): void
    (e: 'update:heightPerChannel', value: number): void
}>()

function toggleShowMetrics() {
    emit('update:showMetrics', !props.showMetrics)
}

function toggleShowAnnotations() {
    emit('update:showAnnotations', !props.showAnnotations)
}

const showSettings = ref(false)

</script>

<template>
    <div class="flex flex-col border border-gray-900 rounded p-2">
        <span> Settings panel: </span>
        <div>
            <input type="checkbox" :checked="showSettings" @change="(() => showSettings = !showSettings)">
        </div>
        <div v-show="showSettings">
            <span> Show metrics panel </span>
            <input type="checkbox" :checked="showMetrics" @change="toggleShowMetrics">

            <span> Show annotations panel </span>
            <input type="checkbox" :checked="showAnnotations" @change="toggleShowAnnotations">

            <span> Height per channel </span>
            <input type="number" :value="heightPerChannel"
                @change="(e) => emit('update:heightPerChannel', parseInt((e.target as HTMLInputElement).value))">
        </div>
    </div>
</template>

<style scoped></style>
