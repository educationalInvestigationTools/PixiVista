<script setup lang="ts">
const props = defineProps<{
    visibility: boolean
}>()

const emit = defineEmits<{
    (e: 'toggleVisibility'): void
}>()

function toggleVisibility() {
    emit('toggleVisibility')
}
</script>

<template>
    <button class="visibility-toggle__button" type="button" @click="toggleVisibility"
        :title="props.visibility ? 'Hide' : 'Show'" :aria-label="props.visibility ? 'Hide' : 'Show'">
        <svg v-if="props.visibility" class="visibility-toggle__icon" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z" />
            <circle cx="12" cy="12" r="3" />
        </svg>

        <svg v-else class="visibility-toggle__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M17.94 17.94A10.89 10.89 0 0 1 12 20c-6 0-10-8-10-8a21.35 21.35 0 0 1 5.06-6.94" />
            <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
            <path d="M1 1l22 22" />
            <path d="M14.12 14.12 9.88 9.88" />
            <path d="M7.5 7.5A10.86 10.86 0 0 1 12 4c6 0 10 8 10 8a21.38 21.38 0 0 1-3.22 4.47" />
        </svg>
    </button>
</template>

<style scoped>
.visibility-toggle__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    padding: 0;
    border: none;
    background: transparent;
    color: var(--ui-text-muted);
    cursor: pointer;
}

.visibility-toggle__icon {
    width: 14px;
    height: 14px;
}
</style>
