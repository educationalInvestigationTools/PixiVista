<script setup lang="ts">
import { computed, inject } from 'vue'

import chevronDownIcon from '@assets/icons/chevron-down.svg'
import { resolveTreeToggleSize, TREE_ROW_METRICS_KEY } from '@/presentation/tree/treeLayout';


const props = defineProps<{
    hasChildren: boolean
    isCollapsed: boolean
    toggleCollapse: () => void
}>()

const treeRowMetrics = inject(TREE_ROW_METRICS_KEY, null)
const toggleSize = computed(() => treeRowMetrics?.toggleSize.value ?? resolveTreeToggleSize(0))
</script>

<template>
    <div class="tree-row">
        <div v-if="props.hasChildren" class="tree-row__toggle-slot" :style="{ width: `${toggleSize}px`, flexBasis: `${toggleSize}px` }">
            <button
                class="tree-row__toggle"
                :style="{ width: `${toggleSize}px`, height: `${toggleSize}px` }"
                type="button"
                :title="props.isCollapsed ? 'Expand' : 'Collapse'"
                :aria-label="props.isCollapsed ? 'Expand' : 'Collapse'"
                :aria-expanded="!props.isCollapsed"
                @click="props.toggleCollapse">
                <img
                    class="tree-row__toggle-icon"
                    :class="{ 'tree-row__toggle-icon--collapsed': props.isCollapsed }"
                    :style="{ width: `${Math.max(toggleSize - 4, 0)}px`, height: `${Math.max(toggleSize - 4, 0)}px` }"
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
    gap: var(--tree-row-inline-gap, 6px);
    font-size: clamp(12px, 1.4vw, 14px);
    font-family: var(--ui-font);
}

.tree-row__toggle-slot {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.tree-row__toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
}

.tree-row__toggle-icon {
    transition: transform 0.15s ease;
    filter: var(--ui-icon-filter);
}

.tree-row__toggle-icon--collapsed {
    transform: rotate(-90deg);
}
</style>
