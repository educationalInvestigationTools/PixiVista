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
    <div class="border border-slate-700 rounded p-3 bg-black text-slate-200">
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
                            <span class="annotation__item__icon"
                                :class="object.shape === 'rectangle' ? 'annotation__item__icon--rectangle' : 'annotation__item__icon--dashed-line'"></span>
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
    gap: 6px;
}

.annotations__col {
    display: flex;
    flex: 1 1 0;
    min-width: 0;
    flex-direction: column;
    padding: 9px 14px;
    border-right: 1px solid #ffffff;
}

.annotations__group__header {
    display: block;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    border-bottom: 1px solid #ffffff;
    padding-bottom: 5px;
    margin-bottom: 4px;
    min-width: 0;
    width: 100%;
    line-height: 1.35;
    white-space: normal;
    overflow-wrap: anywhere;
    word-break: break-word;
}

.annotations__group__items {
    display: flex;
    flex-wrap: wrap;
    min-width: 0;
    width: 100%;
    gap: 8px;
    align-items: flex-start;
}

.annotation__item {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    column-gap: 8px;
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
    width: 18px;
    height: 14px;
    align-self: center;
    min-width: 0;
    flex-shrink: 0;
}

.annotation__item__icon {
    display: block;
    width: 18px;
    height: 12px;
    background-color: currentColor;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    -webkit-mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;
    mask-size: contain;
}

.annotation__item__icon--rectangle {
    -webkit-mask-image: url('../../../assets/icons/annotation-rectangle.svg');
    mask-image: url('../../../assets/icons/annotation-rectangle.svg');
}

.annotation__item__icon--dashed-line {
    -webkit-mask-image: url('../../../assets/icons/annotation-dashed-line.svg');
    mask-image: url('../../../assets/icons/annotation-dashed-line.svg');
}

.annotation__item__label {
    display: block;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #aaa;
    letter-spacing: 0.2px;
    min-width: 0;
    width: 100%;
    max-width: 100%;
    line-height: 1.35;
    white-space: normal;
    overflow-wrap: anywhere;
    word-break: break-word;
}

.annotation__item--off .annotation__item__label {
    text-decoration: line-through;
    color: #666;
}
</style>
