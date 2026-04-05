<script setup lang="ts">
import { ref, type Ref } from 'vue';
import AnnotationsComponent, { type ObjectAnnotationData } from './AnnotationsComponent.vue';

const group1 = "N1"
const group2 = "N2"
const group3 = "N3"

const objectAnnotation1: ObjectAnnotationData = {
    label: "Los Spindles Super Poderosos",
    group: group1,
    visibility: true,
    color: "red",
    shape: "rectangle"
}

const objectAnnotation2: ObjectAnnotationData = {
    label: "K-Complex, Nada interesantes",
    group: group1,
    visibility: true,
    color: "yellow",
    shape: "rectangle"
}

const objectAnnotation3: ObjectAnnotationData = {
    label: "La vida en si Y mucho mas",
    group: group1,
    visibility: true,
    color: "blue",
    shape: "dashed-lines"
}

const objectAnnotations: Ref<Record<string, Record<string, ObjectAnnotationData>>> = ref({})

objectAnnotations.value[group1] = {}
objectAnnotations.value[group2] = {}
objectAnnotations.value[group3] = {}

objectAnnotations.value[group1][objectAnnotation1.label] = objectAnnotation1
objectAnnotations.value[group1][objectAnnotation2.label] = objectAnnotation2
objectAnnotations.value[group1][objectAnnotation3.label] = objectAnnotation3

</script>

<template>
    <AnnotationsComponent :objectsAnnotations="objectAnnotations" @toggleObjectVisibility="(objVisibility) => objectAnnotations[objVisibility.groupLabel]![objVisibility.label]!.visibility = objVisibility.visibility"></AnnotationsComponent>
</template>

<style scoped></style>
