<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

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
    <div class="setting-row" ref="rootRef">
        <span class="setting-label">{{ props.label }}</span>
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
    </div>
</template>

<style scoped>
.setting-row {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 6px 10px;
    background: #0b0b0b;
    border: 1px solid #2a2a2a;
    box-sizing: border-box;
    height: 54px;
    width: max-content;
}

.setting-label {
    font-size: clamp(12px, 1.5vw, 14px);
    color: #9a9a9a;
    text-transform: uppercase;
    letter-spacing: 1px;
    white-space: nowrap;
}

.string-select {
    position: relative;
}

.string-select__button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border: 1px solid #2a2a2a;
    background: #0f0f0f;
    color: #ffffff;
    cursor: pointer;
    font-size: clamp(12px, 1.5vw, 14px);
    text-transform: uppercase;
    letter-spacing: 1px;
    min-width: 110px;
}

.string-select__button:focus-visible {
    outline: 1px solid #ffffff;
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
    background: #0b0b0b;
    border: 1px solid #2a2a2a;
    z-index: 20;
}

.string-select__option {
    padding: 6px 10px;
    border: 1px solid #2a2a2a;
    background: #000000;
    color: #ffffff;
    cursor: pointer;
    font-size: clamp(12px, 1.5vw, 14px);
    text-transform: uppercase;
    letter-spacing: 1px;
    text-align: left;
}

.string-select__option:focus-visible {
    outline: 1px solid #ffffff;
    outline-offset: 1px;
}

.string-select__option:hover {
    background: #111111;
}
</style>
