<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'

import chevronDownIcon from '@assets/icons/chevron-down.svg'
import { resolveTreeToggleSize, TREE_ROW_METRICS_KEY, TREE_TOGGLE_LAYOUT_SIZE } from '@/presentation/tree/treeLayout'


const props = defineProps<{
    hasChildren: boolean
    isCollapsed: boolean
    toggleCollapse: () => void
    reportContentHeight?: (height: number) => void
}>()

const treeRowMetrics = inject(TREE_ROW_METRICS_KEY, null)
const toggleSize = computed(() => treeRowMetrics?.toggleSize.value ?? resolveTreeToggleSize())
const iconSize = computed(() => Math.max(12, Math.min(TREE_TOGGLE_LAYOUT_SIZE, toggleSize.value)))
const contentElement = ref<HTMLElement | null>(null)

let resizeObserver: ResizeObserver | null = null

function notifyContentHeight(height: number) {
    props.reportContentHeight?.(height)
}

onMounted(() => {
    if (!contentElement.value) {
        return
    }

    notifyContentHeight(contentElement.value.getBoundingClientRect().height)

    resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0]
        if (!entry) {
            return
        }

        notifyContentHeight(entry.contentRect.height)
    })

    resizeObserver.observe(contentElement.value)
})

onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
})
</script>

<template>
    <div class="tree-row">
        <div v-if="props.hasChildren" class="tree-row__toggle-slot">
            <button
                class="tree-row__toggle"
                :style="{ width: `${TREE_TOGGLE_LAYOUT_SIZE}px`, height: `${TREE_TOGGLE_LAYOUT_SIZE}px` }"
                type="button"
                :title="props.isCollapsed ? 'Expand' : 'Collapse'"
                :aria-label="props.isCollapsed ? 'Expand' : 'Collapse'"
                :aria-expanded="!props.isCollapsed"
                @click="props.toggleCollapse">
                <img
                    class="tree-row__toggle-icon"
                    :class="{ 'tree-row__toggle-icon--collapsed': props.isCollapsed }"
                    :style="{ width: `${iconSize}px`, height: `${iconSize}px` }"
                    :src="chevronDownIcon"
                    />
            </button>
        </div>
        <div ref="contentElement" class="tree-row__content">
            <slot />
        </div>
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
    width: var(--tree-toggle-layout-size, 18px);
    flex: 0 0 var(--tree-toggle-layout-size, 18px);
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.tree-row__content {
    display: block;
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
