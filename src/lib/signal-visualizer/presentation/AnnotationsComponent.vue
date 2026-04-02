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
    <div class="border border-slate-700 rounded p-2  bg-black text-slate-200">
        <div class="annotations">
            <div class="annotations__col" v-for="(objectGroup, groupLabel) in props.objectsAnnotations"
                :key="groupLabel">
                <span class="annotations__group__header"> {{ groupLabel }} </span>
                <div class="annotations__group__items">

                    <div class="annotation__item" v-for="(object, objectLabel) in objectGroup" :key="objectLabel"
                        :class="{ 'annotation__item--off': !object.visibility }"
                        @click="toggleShow(groupLabel, objectLabel)"
                        :title="object.visibility ? 'Click to hide' : 'Click to show'">
                        <span class="annotation__item__style" :style="{ color: object.color }" aria-hidden="true">
                            <svg v-if="object.shape === 'rectangle'" class="annotation__item__icon" viewBox="0 0 16 10"
                                fill="none">
                                <rect x="1.25" y="1.25" width="13.5" height="7.5" stroke="currentColor"
                                    stroke-width="1.5" />
                            </svg>
                            <svg v-else class="annotation__item__icon" viewBox="0 0 16 10" fill="none">
                                <line x1="1" y1="5" x2="15" y2="5" stroke="currentColor" stroke-width="1.5"
                                    stroke-linecap="round" stroke-dasharray="3 2" />
                            </svg>
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
    min-width: 0;
}

.annotations__col {
    display: flex;
    flex: 1 1 0;
    min-width: 0;
    flex-direction: column;
    padding: 6px 12px;
    border-right: 1px solid #ffffff;
}

.annotations__group__header {
    display: block;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 10px;
    font-weight: 600;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    border-bottom: 1px solid #ffffff;
    padding-bottom: 3px;
    min-width: 0;
    width: 100%;
    line-height: 1.25;
    white-space: normal;
    overflow-wrap: anywhere;
    word-break: break-word;
}

.annotations__group__items {
    display: flex;
    flex-wrap: wrap;
    min-width: 0;
    width: 100%;
    gap: 2px;
    align-items: flex-start;
}

.annotation__item {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: flex-start;
    column-gap: 5px;
    min-width: 0;
    max-width: 100%;
    white-space: normal;
    overflow-wrap: anywhere;
    word-break: break-word;
    cursor: pointer;
    transition: opacity 0.15s;
}

.annotation__item--off {
    opacity: 0.35;
}

.annotation__item__style {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 12px;
    min-width: 0;
    flex-shrink: 0;
}

.annotation__item__icon {
    display: block;
    width: 16px;
    height: 10px;
}

.annotation__item__label {
    display: block;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 11px;
    color: #aaa;
    letter-spacing: 0.2px;
    min-width: 0;
    width: 100%;
    max-width: 100%;
    line-height: 1.2;
    white-space: normal;
    overflow-wrap: anywhere;
    word-break: break-word;
}

.annotation__item--off .annotation__item__label {
    text-decoration: line-through;
    color: #666;
}

</style>
