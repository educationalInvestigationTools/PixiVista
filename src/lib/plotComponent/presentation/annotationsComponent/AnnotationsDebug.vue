<script setup lang="ts">
import type { ObjectAnnotationData } from '@/plotComponent/presentation/annotationsComponent/AnnotationsComponent.vue';
import AnnotationsComponent from '@/plotComponent/presentation/annotationsComponent/AnnotationsComponent.vue';
import { ref, type Ref } from 'vue';

const group1 = "N1"
const group2 = "N2"
const group3 = "N3"

const objectAnnotation1: ObjectAnnotationData = {
    label: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    group: group1,
    visibility: true,
    color: "red",
    shape: "rectangle"
}

const objectAnnotation2: ObjectAnnotationData = {
    label: "bbbbbbbbbbbbbbbbbbbBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB ",
    group: group1,
    visibility: true,
    color: "yellow",
    shape: "rectangle"
}

const objectAnnotation3: ObjectAnnotationData = {
    label: "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
    group: group1,
    visibility: true,
    color: "blue",
    shape: "dashed-lines"
}

const objectAnnotation4: ObjectAnnotationData = {
    label: "La vida en sissssssssssi Y mucho mas",
    group: group2,
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
objectAnnotations.value[group2][objectAnnotation4.label] = objectAnnotation4


</script>

<template>
    <AnnotationsComponent :objectsAnnotations="objectAnnotations" @toggleObjectVisibility="(objVisibility) => objectAnnotations[objVisibility.groupLabel]![objVisibility.label]!.visibility = objVisibility.visibility"></AnnotationsComponent>
</template>

<style scoped></style>
