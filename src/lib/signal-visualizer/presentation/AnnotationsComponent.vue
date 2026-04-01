<script setup lang="ts">

export type ObjectAnnotationData = {
    label: string
    group: string
    visibility: boolean
    shape: 'rectangle' | 'dashed-lines'
}

export type ObjectVisibility = {
    groupLabel: string,
    label: string,
    visibility: boolean
}

const props = defineProps<{
    objectsAnnotations: Record<string, Record<string, ObjectAnnotationData>> // {group : { objectLabel : object } }
}>()

const emit = defineEmits<{
    (e: 'toggleObjectVisibility', objectVisibility: ObjectVisibility): void
}>()

function toggleShow(groupLabel: string, objectLabel: string) {
    emit("toggleObjectVisibility", {
        groupLabel: groupLabel,
        label: objectLabel,
        visibility: !(props.objectsAnnotations[groupLabel]![objectLabel]!.visibility)
    })
}

</script>

<template>
    <div class="flex flex-col border border-gray-900 rounded p-2">
        <span> Annotations panel: </span>
        <div v-for="(objectGroup, groupLabel) in props.objectsAnnotations" :key="groupLabel">
            <span> {{ groupLabel }} </span>
            <span class="inline-block px-0.5" v-for="(object, objectLabel) in objectGroup" :key="objectLabel">
                <span> {{ object.shape }} {{ object.label }}</span>
                <input type="checkbox" :checked="object.visibility" @change="toggleShow(groupLabel, objectLabel)">
            </span>
        </div>
        <div>
        </div>
    </div>
</template>

<style scoped></style>
