<script setup lang="ts">
import type { LabelTreeNode } from '@/presentation/settingsComponent/settingsTreeNodes';
import SettingRow from './SettingRow.vue';

const props = defineProps<{
    node : LabelTreeNode
    hasChildren?: boolean
    isCollapsed?: boolean
}>()

const emit = defineEmits<{
    (e: 'toggle-collapse'): void
}>()

function toggleCollapse() {
    if (props.hasChildren) {
        emit('toggle-collapse')
    }
}

</script>

<template>
    <SettingRow :label="props.node.label">
        <template #label-prefix>
            <button
                class="setting-chevron"
                :class="{
                    'setting-chevron--collapsed': props.isCollapsed,
                    'setting-chevron--hidden': !props.hasChildren,
                }"
                type="button"
                :disabled="!props.hasChildren"
                :aria-expanded="props.hasChildren ? !props.isCollapsed : undefined"
                :title="props.hasChildren ? (props.isCollapsed ? 'Expand' : 'Collapse') : 'No children'"
                @click="toggleCollapse">
                <svg class="setting-chevron__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>
        </template>
        <span class="setting-spacer" aria-hidden="true"></span>
    </SettingRow>
</template>

<style scoped>
.setting-chevron {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    padding: 0;
    border: 1px solid var(--ui-panel-border);
    background: var(--ui-panel-surface);
    color: var(--ui-text-muted);
    cursor: pointer;
    transition: transform 0.15s ease;
}

.setting-chevron:disabled {
    cursor: default;
    opacity: 0.45;
}

.setting-chevron--collapsed {
    transform: rotate(-90deg);
}

.setting-chevron--hidden {
    visibility: hidden;
}

.setting-chevron__icon {
    width: 16px;
    height: 16px;
}

.setting-spacer {
    min-width: 70px;
}

</style>
