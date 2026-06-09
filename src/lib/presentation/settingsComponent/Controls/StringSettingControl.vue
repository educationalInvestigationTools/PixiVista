<script setup lang="ts">
import { computed } from 'vue';
import SettingRow from '@/presentation/settingsComponent/SettingRow.vue';
import FloatingPopover from '@/presentation/utils/FloatingPopover.vue';

const props = defineProps<{
    label: string
    value: string
    options: string[]
    format?: (arg0: string) => string
}>()

const emit = defineEmits<{
    (e: 'update:value', value: string): void
}>()

const displayValue = computed(() => {
    if (props.format) {
        return props.format(props.value)
    }
    return props.value
})

function selectOption(option: string, closeMenu: () => void) {
    emit('update:value', option)
    closeMenu()
}
</script>

<template>
    <SettingRow :label="props.label">
        <FloatingPopover placement="bottom-start" :offset-value="4">

            <template #trigger="{ toggle, isOpen }">
                <button
                    class="string-select__button"
                    type="button"
                    :aria-expanded="isOpen"
                    @click="toggle">
                    <span class="string-select__value">{{ displayValue }}</span>
                    <span class="string-select__chevron">▼</span>
                </button>
            </template>

            <template #content="{ close }">
                <div class="string-select__menu" role="listbox">
                    <button
                        v-for="option in props.options"
                        :key="option"
                        class="string-select__option"
                        type="button"
                        role="option"
                        @click="selectOption(option, close)">
                        {{ option }}
                    </button>
                </div>
            </template>

        </FloatingPopover>
    </SettingRow>
</template>

<style scoped>
.string-select__button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border: 1px solid var(--ui-panel-border);
    background: var(--ui-panel-surface);
    color: var(--ui-text-primary);
    cursor: pointer;
    font-size: clamp(12px, 1.5vw, 14px);
    letter-spacing: 1px;
}

.string-select__button:focus-visible {
    outline: 1px solid var(--ui-focus-color);
    outline-offset: 1px;
}

.string-select__value {
    flex: 1;
    text-align: center;
}

.string-select__chevron {
    font-size: 10px;
    opacity: 0.8;
}

.string-select__menu {
    padding: 6px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: var(--ui-panel-row-bg);
    border: 1px solid var(--ui-panel-border);
    min-width: 140px;
}

.string-select__option {
    padding: 6px 10px;
    border: 1px solid var(--ui-panel-border);
    background: var(--ui-panel-bg);
    color: var(--ui-text-primary);
    cursor: pointer;
    font-size: clamp(12px, 1.5vw, 14px);
    letter-spacing: 1px;
    text-align: center;
}

.string-select__option:focus-visible {
    outline: 1px solid var(--ui-focus-color);
    outline-offset: 1px;
}

.string-select__option:hover {
    background: var(--ui-hover-bg);
}
</style>
