<script setup lang="ts">
import { ref } from 'vue';

import SettingsTreeComponent from '@/presentation/settingsComponent/SettingsTreeComponent.vue';
import type { AnyUpdateChoice } from '@/presentation/settingsComponent/settingsChoice';
import type { SettingsTreeNode } from '@/presentation/settingsComponent/settingsTreeNodes';

import TreePanel from '@/presentation/tree/TreePanel.vue';

const props = defineProps<{
    trees: SettingsTreeNode[]
}>()

const emit = defineEmits<{
    (e: 'update:choice', update: AnyUpdateChoice): void
}>()

const showSettings = ref(true)
</script>

<template>
    <TreePanel :show="showSettings" :nodes="props.trees">
        <template #header>
            <div class="settings-header">
                <span>Settings</span>
                <button class="settings__toggle" @click="showSettings = !showSettings">
                    {{ showSettings ? 'Hide' : 'Show' }}
                </button>
            </div>
        </template>

        <template #node="{ node }">
            <SettingsTreeComponent :node="node" @update:choice="(update) => emit('update:choice', update)" />
        </template>
    </TreePanel>
</template>

<style scoped>
.settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    font-size: inherit;
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
</style>
