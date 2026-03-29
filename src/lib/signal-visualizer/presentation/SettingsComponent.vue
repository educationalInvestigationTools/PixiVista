<script setup lang="ts">

const props = defineProps<{
    showMetrics: boolean
    showAnnotations : boolean
}>()


const emit = defineEmits<{
    (e: 'update:showMetrics', value: boolean): void
    (e: 'update:showAnnotations', value : boolean) : void
}>()

function toggleShowMetrics() {
    emit('update:showMetrics', !props.showMetrics)
}

function toggleShowAnnotations() {
    emit('update:showAnnotations', !props.showAnnotations)
}

</script>

<template>
    <div class="flex flex-col border border-gray-900 rounded p-2">
        <span> Settings panel: </span>
        <div>
            <span> Show metrics panel </span>
            <input type="checkbox" :checked="showMetrics" @change="toggleShowMetrics">

            <span> Show annotations panel </span>
            <input type="checkbox" :checked="showAnnotations" @change="toggleShowAnnotations">
        </div>

    </div>
</template>

<style scoped></style>
