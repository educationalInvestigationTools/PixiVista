<script setup lang="ts">

import AnnotationTreeNode from '@/presentation/annotationsComponent/AnnotationTreeNode.vue'
import type {
    AnnotationNode,
} from '@/presentation/annotationsComponent/objectAnnotationData'
import TreePanel from '@/presentation/tree/TreePanel.vue';
const props = defineProps<{
    annotations: AnnotationNode[]
}>()

</script>

<template>
    <TreePanel :show="true" :nodes="props.annotations">
        <template #header>
            <div class="annotations-header">
                <span>
                    Annotations
                </span>
            </div>
        </template>

        <template #node="{ node }">
            <AnnotationTreeNode :node="node" />
        </template>

        <template #empty>
            <span>No annotations available.</span>
        </template>
    </TreePanel>
</template>

<style scoped>

</style>
