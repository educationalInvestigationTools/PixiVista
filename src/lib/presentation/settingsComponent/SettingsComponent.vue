<script setup lang="ts">
import { ref } from 'vue';

import TreeView from '@/presentation/tree/TreeView.vue';
import SettingsTreeComponent from '@/presentation/settingsComponent/SettingsTreeComponent.vue';
import type { AnyUpdateChoice } from '@/presentation/settingsComponent/settingsChoice';
import type { SettingsTreeNode } from '@/presentation/settingsComponent/settingsTreeNodes';

const props = defineProps<{
    trees: SettingsTreeNode[]
}>()

const emit = defineEmits<{
    (e: 'update:choice', update: AnyUpdateChoice): void
}>()

const showSettings = ref(true)
</script>

<template>
    <div class="settings">
        <button class="settings__toggle" type="button"
            :title="showSettings ? 'Hide settings panel' : 'Show settings panel'" @click="showSettings = !showSettings">
            <span class="settings__toggle-label">Settings</span>
            <span class="settings__toggle-state">{{ showSettings ? 'HIDE' : 'SHOW' }}</span>
        </button>

        <div v-show="showSettings" class="settings__panel">
            <div v-for="(tree) in props.trees" :key="tree.id" class="settings__tree-root">
                <TreeView :node="tree" :depth="0" :ancestorHasNext="[]" :isLast="true" v-slot="{ node }">
                    <SettingsTreeComponent :node="node" @update:choice="(update) => emit('update:choice', update)" />
                </TreeView>
            </div>
        </div>
    </div>
</template>

<style scoped>
.settings {
    --settings-max-height: 360px;
    --settings-header-height: 40px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 4px;
    max-height: var(--settings-max-height);
    background: var(--ui-panel-bg);
    border: 1px solid var(--ui-panel-border);
    font-family: var(--ui-font);
}

.settings__toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 10px;
    border: none;
    background: transparent;
    color: var(--ui-text-primary);
    cursor: pointer;
    letter-spacing: 1px;
    font-size: clamp(12px, 1.5vw, 14px);
    font-weight: 600;
}

.settings__toggle:focus-visible {
    outline: 1px solid var(--ui-focus-color);
    outline-offset: 1px;
}

.settings__toggle-label {
    color: var(--ui-text-muted);
}

.settings__toggle-state {
    color: var(--ui-text-primary);
}

.settings__panel {
    display: flex;
    flex-wrap: nowrap;
    align-items: stretch;
    gap: 8px;
    padding: 4px;
    background: var(--ui-panel-bg);
    border: 1px solid var(--ui-panel-border);
    overflow-x: auto;
    overflow-y: auto;
}

.settings__tree-root {
    flex: 0 0 auto;
    padding: 6px;
    border: 1px solid var(--ui-panel-border);
    background: var(--ui-panel-row-bg);
    overflow-y: auto;
}
</style>
