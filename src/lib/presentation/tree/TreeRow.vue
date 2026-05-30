<script setup lang="ts">
import chevronDownIcon from '@assets/icons/chevron-down.svg'

import { TREE_TOGGLE_WIDTH } from './treeLayout'

const props = defineProps<{
    hasChildren: boolean
    isCollapsed: boolean
    toggleCollapse: () => void
}>()
</script>

<template>
    <div class="tree-row" :style="{ '--tree-toggle-width': `${TREE_TOGGLE_WIDTH}px` }">
        <div v-if="props.hasChildren" class="tree-row__toggle-slot">
            <button
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
                    />
            </button>
        </div>
        <slot />
    </div>
</template>

<style scoped>
.tree-row {
    display: flex;
    align-items: center;
    font-size: clamp(12px, 1.4vw, 14px);
    font-family: var(--ui-font);
}

.tree-row__toggle-slot {
    flex: 0 0 var(--tree-toggle-width);
    width: var(--tree-toggle-width);
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.tree-row__toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--tree-toggle-width);
    height: var(--tree-toggle-width);
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
}

.tree-row__toggle-icon {
    width: calc(var(--tree-toggle-width) - 4px);
    height: calc(var(--tree-toggle-width) - 4px);
    transition: transform 0.15s ease;
    filter: var(--ui-icon-filter);
}

.tree-row__toggle-icon--collapsed {
    transform: rotate(-90deg);
}
</style>
