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
    <div class="border border-slate-700 rounded p-2  bg-slate-900 text-slate-200">
        <div class="annotations">
            <div class="annotations__col" v-for="(objectGroup, groupLabel) in props.objectsAnnotations"
                :key="groupLabel">
                <span class="annotations__group__header"> {{ groupLabel }} </span>
                <div class="annotations_group__items">

                    <div class="annotation__item" v-for="(object, objectLabel) in objectGroup" :key="objectLabel"
                        :class="{ 'annotation__item--off': !object.visibility }"
                        @click="toggleShow(groupLabel, objectLabel)"
                        :title="object.visibility ? 'Click to hide' : 'Click to show'">
                        <span class="annotation__item__style" :style="{ color: object.color }"> {{ object.shape }}
                        </span>
                        <span class="annotation__item__label"> {{ object.label }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.annotations {
    display: flex;
}

.annotations__col {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 6px 12px;
    border-right: 1px solid #ffffff;
}

.annotations__group__header {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 10px;
    font-weight: 600;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    border-bottom: 1px solid #ffffff;
    padding-bottom: 3px;
}

.annotations__group__items {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    transition: opacity 0.15s;
}

.annotation__item {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    transition: opacity 0.15s;
}

.annotation__item--off {
    opacity: 0.35;
}

.annotation__item__style {
    font-family: monospace;
    font-size: 12px;
    line-height: 1;
    flex-shrink: 0;
}

.annotation__item__label {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 11px;
    color: #aaa;
    letter-spacing: 0.2px;
}

.annotation__item--off .annotation__item__label {
    text-decoration: line-through;
    color: #666;
}

.annotation__item--off .annotation__item__style {
    color: #555
}
</style>
