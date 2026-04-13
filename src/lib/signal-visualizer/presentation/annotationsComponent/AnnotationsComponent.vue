<script setup lang="ts">

export type ObjectAnnotationData = {
    label: string
    group: string
    visibility: boolean
    color: string
    shape: 'rectangle' | 'dashed-lines'
}

export type ObjectVisibility = {
    groupLabel: string,
    label: string,
    visibility: boolean
}

const props = defineProps<{
    objectsAnnotations: Map<string, Map<string, ObjectAnnotationData>> // {group : { objectLabel : object } }
}>()

const emit = defineEmits<{
    (e: 'toggleObjectVisibility', objectVisibility: ObjectVisibility): void
}>()

function toggleShow(groupLabel: string, objectLabel: string) {
    emit("toggleObjectVisibility", {
        groupLabel: groupLabel,
        label: objectLabel,
        visibility: !(props.objectsAnnotations.get(groupLabel)!.get(objectLabel)!.visibility)
    })
}

import rectangleIcon from '@/assets/icons/rectangle.svg';
import dashedLinesIcon from '@/assets/icons/dashed-line.svg';

</script>

<template>
    <div class="annotations__menu">
        <div class="annotations__group" v-for="[groupLabel, objectGroup] of props.objectsAnnotations" :key="groupLabel">
            <span class="annotations__group--header"> {{ groupLabel }} </span>
            <div class="annotations__group--items">
                <div class="annotation__item" v-for="[objectLabel, object] of objectGroup" :key="objectLabel">
                    <img class="annotation__item__icon" :class="{ 'annotation__item_icon--off': !object.visibility }"
                        :src="object.shape === 'rectangle' ? rectangleIcon : dashedLinesIcon"
                        :style="{ backgroundColor: object.color }">
                    <span class="annotation__item__label"
                        :class="{ 'annotation__item__label--off': !object.visibility }"
                        @click="toggleShow(groupLabel, objectLabel)"
                        :title="object.visibility ? 'Click to hide' : 'Click to show'"> {{ object.label }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.annotations__menu {
    display: flex;
    flex-direction: row;
    border: 3px;
    border-radius: 1px;
    padding: 10px;

    background-color: #020617;
}

.annotations__group {
    display: flex;
    width: 100%;
    padding: 5px;
    margin: 4px;
    flex-direction: column;
}

.annotations__group--header {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 16px;
    font-weight: 900;
    color: #888;
    width: 100%;
    white-space: normal;
    overflow-wrap: anywhere;
    word-break: break-word;
    margin-bottom: 5px;
}

.annotations__group--items {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 8px;
    align-items: flex-start;
    border: 0.5px solid white;
}

.annotation__item {
    display: flex;
    flex-direction: row;
    gap: 13px;
    align-items: center;
}

.annotation__item__icon {
    height: 15px;
}

.annotation__item_icon--off {
    opacity: 0.35;
}

.annotation__item__label {
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    word-break: break-all;
}

.annotation__item__label--off {
    opacity: 0.35;
    text-decoration: line-through;
    color: #666;
}
</style>
