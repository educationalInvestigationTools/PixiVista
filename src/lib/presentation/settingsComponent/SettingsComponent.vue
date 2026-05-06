<script setup lang="ts">
import { ref } from 'vue';

import type { AnyChoice, AnyUpdateChoice, NumberSettingChoice, StringSettingChoice } from '@/presentation/settingsComponent/settingsChoice';
import BooleanSettingControl from '@/presentation/settingsComponent/BooleanSettingControl.vue';
import NumberSettingControl from '@/presentation/settingsComponent/NumberSettingControl.vue';
import StringSettingControl from '@/presentation/settingsComponent/StringSettingControl.vue';

const props = defineProps<{
    choices: AnyChoice[]
}>()

const emit = defineEmits<{
    (e: 'update:choice', update: AnyUpdateChoice): void
}>()

const showSettings = ref(true)

function updateBooleanChoice(choiceId: string, value: boolean) {
    emit('update:choice', { id: choiceId, value })
}

function updateNumberChoice(choice: NumberSettingChoice, value: number) {
    emit('update:choice', { id: choice.id, value })
}

function updateStringChoice(choiceId: string, value: string) {
    emit('update:choice', { id: choiceId, value })
}
</script>

<template>
    <div class="settings" :class="{ 'settings--collapsed': !showSettings }">
        <button
            class="settings__toggle"
            type="button"
            :title="showSettings ? 'Hide settings panel' : 'Show settings panel'"
            @click="showSettings = !showSettings">
            <span class="settings__toggle-label">Settings</span>
            <span class="settings__toggle-state">{{ showSettings ? 'HIDE' : 'SHOW' }}</span>
        </button>

        <div v-show="showSettings" class="settings__panel">
            <template v-for="choice in props.choices" :key="choice.id">
                <BooleanSettingControl
                    v-if="typeof choice.value === 'boolean'"
                    :label="choice.label"
                    :value="choice.value"
                    @update:value="(value) => updateBooleanChoice(choice.id, value)"
                />

                <NumberSettingControl
                    v-else-if="typeof choice.value === 'number'"
                    :label="choice.label"
                    :value="choice.value"
                    :min="(choice as NumberSettingChoice).min"
                    :max="(choice as NumberSettingChoice).max"
                    :format="(choice as NumberSettingChoice).format"
                    @update:value="(value) => updateNumberChoice(choice as NumberSettingChoice, value)"
                />

                <StringSettingControl
                    v-else-if="typeof choice.value === 'string'"
                    :label="choice.label"
                    :value="choice.value"
                    :options="(choice as StringSettingChoice).options"
                    :format="(choice as StringSettingChoice).format"
                    @update:value="(value) => updateStringChoice(choice.id, value)"
                />
            </template>
        </div>
    </div>
</template>

<style scoped>
.settings {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 4px;
    background: var(--ui-panel-bg);
    border: 1px solid var(--ui-panel-border);
    font-family: var(--ui-font);
}

.settings--collapsed {
    padding-bottom: 2px;
}

.settings__toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 10px;
    border: 1px solid var(--ui-panel-border);
    background: var(--ui-panel-row-bg);
    color: var(--ui-text-primary);
    cursor: pointer;
    text-transform: uppercase;
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
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 6px 8px;
    padding: 4px;
    background: var(--ui-panel-bg);
    border: 1px solid var(--ui-panel-border);
}
</style>
