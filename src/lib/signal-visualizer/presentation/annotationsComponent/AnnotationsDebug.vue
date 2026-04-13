<script setup lang="ts">
import { ref, type Ref } from 'vue';
import AnnotationsComponent, { type ObjectAnnotationData } from './AnnotationsComponent.vue';

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



const objectAnnotations: Ref<Map<string, Map<string, ObjectAnnotationData>>> = ref(new Map())

objectAnnotations.value.set(group1, new Map())
objectAnnotations.value.set(group2, new Map())
objectAnnotations.value.set(group3, new Map())

objectAnnotations.value.get(group1)?.set(objectAnnotation1.label, objectAnnotation1)
objectAnnotations.value.get(group1)?.set(objectAnnotation2.label, objectAnnotation2)
objectAnnotations.value.get(group1)?.set(objectAnnotation3.label, objectAnnotation3)
objectAnnotations.value.get(group2)?.set(objectAnnotation4.label, objectAnnotation4)


</script>

<template>
    <AnnotationsComponent :objectsAnnotations="objectAnnotations"
        @toggleObjectVisibility="(objVisibility) => objectAnnotations.get(objVisibility.groupLabel)!.get(objVisibility.label)!.visibility = objVisibility.visibility">
    </AnnotationsComponent>
</template>

<style scoped></style>
