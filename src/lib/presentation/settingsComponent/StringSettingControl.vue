<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, type VNodeRef } from 'vue';
import SettingRow from './SettingRow.vue';

const props = defineProps<{
    label: string
    value: string
    options: string[]
    format?: (arg0: string) => string
}>()

const emit = defineEmits<{
    (e: 'update:value', value: string): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)

const setRootRef: VNodeRef = (el) => {
    rootRef.value = el as HTMLElement | null
}

const displayValue = computed(() => {
    if (props.format) {
        return props.format(props.value)
    }
    return props.value
})

function toggleOpen() {
    isOpen.value = !isOpen.value
}

function selectOption(option: string) {
    emit('update:value', option)
    isOpen.value = false
}

function handleClickAway(event: PointerEvent) {
    if (!isOpen.value) return
    const target = event.target as Node | null
    const rootEl = rootRef.value
    if (rootEl && target && !rootEl.contains(target)) {
        isOpen.value = false
    }
}

onMounted(() => {
    document.addEventListener('pointerdown', handleClickAway)
})

onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handleClickAway)
})
</script>

<template>
    <SettingRow :label="props.label" :root-ref="setRootRef">
        <div class="string-select">
            <button
                class="string-select__button"
                type="button"
                :aria-expanded="isOpen"
                @click="toggleOpen">
                <span class="string-select__value">{{ displayValue }}</span>
                <span class="string-select__chevron">▼</span>
            </button>
            <div v-if="isOpen" class="string-select__menu" role="listbox">
                <button
                    v-for="option in props.options"
                    :key="option"
                    class="string-select__option"
                    type="button"
                    role="option"
                    @click="selectOption(option)">
                    {{ option }}
                </button>
            </div>
        </div>
    </SettingRow>
</template>

<style scoped>
.string-select {
    position: relative;
}

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
    text-transform: uppercase;
    letter-spacing: 1px;
    min-width: 110px;
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
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    min-width: 100%;
    padding: 6px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: var(--ui-panel-row-bg);
    border: 1px solid var(--ui-panel-border);
    z-index: 20;
}

.string-select__option {
    padding: 6px 10px;
    border: 1px solid var(--ui-panel-border);
    background: var(--ui-panel-bg);
    color: var(--ui-text-primary);
    cursor: pointer;
    font-size: clamp(12px, 1.5vw, 14px);
    text-transform: uppercase;
    letter-spacing: 1px;
    text-align: left;
}

.string-select__option:focus-visible {
    outline: 1px solid var(--ui-focus-color);
    outline-offset: 1px;
}

.string-select__option:hover {
    background: var(--ui-hover-bg);
}
</style>
