<script setup lang="ts">
import chevronDownIcon from '@assets/icons/chevron-down.svg'

defineOptions({ name: 'TreeRow' })

const props = defineProps<{
    hasChildren: boolean
    isCollapsed: boolean
    toggleCollapse: () => void
}>()
</script>

<template>
    <div class="tree-row">
        <button
            v-if="props.hasChildren"
            class="tree-row__toggle"
            type="button"
            :title="props.isCollapsed ? 'Expand' : 'Collapse'"
            :aria-label="props.isCollapsed ? 'Expand' : 'Collapse'"
            :aria-expanded="!props.isCollapsed"
            @click="props.toggleCollapse">
            <img
                class="tree-row__toggle-icon"
                :class="{ 'tree-row__toggle-icon--collapsed': props.isCollapsed }"
                :src="chevronDownIcon"
                alt="" />
        </button>
        <slot />
    </div>
</template>

<style scoped>
.tree-row {
    display: flex;
    align-items: center;
    gap: var(--tree-row-gap, 4px);
    padding: 0;
    margin-left: var(--tree-row-offset, 0px);
    font-size: clamp(12px, 1.4vw, 14px);
    line-height: var(--tree-row-height, 18px);
    min-height: var(--tree-row-height, 18px);
    font-family: var(--ui-font);
}

.tree-row__toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--tree-toggle-size, 18px);
    height: var(--tree-toggle-size, 18px);
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
}

.tree-row__toggle-icon {
    width: 14px;
    height: 14px;
    transition: transform 0.15s ease;
    filter: var(--ui-icon-filter);
}

.tree-row__toggle-icon--collapsed {
    transform: rotate(-90deg);
}
</style>
