<script setup lang="ts">
import chevronDownIcon from '@assets/icons/chevron-down.svg'

const props = defineProps<{
    hasChildren: boolean
    isCollapsed: boolean
    toggleCollapse: () => void
}>()

const toggleSize = 18
const iconSize = 14
</script>

<template>
    <button
        v-if="props.hasChildren"
        class="tree-toggle"
        :style="{ width: `${toggleSize}px`, height: `${toggleSize}px` }"
        type="button"
        :title="props.isCollapsed ? 'Expand' : 'Collapse'"
        :aria-label="props.isCollapsed ? 'Expand' : 'Collapse'"
        :aria-expanded="!props.isCollapsed"
        @click="props.toggleCollapse">
        <img
            class="tree-toggle__icon"
            :class="{ 'tree-toggle__icon--collapsed': props.isCollapsed }"
            :style="{ width: `${iconSize}px`, height: `${iconSize}px` }"
            :src="chevronDownIcon"
        />
    </button>
</template>

<style scoped>
.tree-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
}

.tree-toggle__icon {
    transition: transform 0.15s ease;
    filter: var(--ui-icon-filter);
}

.tree-toggle__icon--collapsed {
    transform: rotate(-90deg);
}
</style>
