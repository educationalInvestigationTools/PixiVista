<script setup lang="ts">
import { ref } from 'vue';


const props = defineProps<{
    showMetrics: boolean
    showAnnotations: boolean
    heightPerChannel: number
}>()


const emit = defineEmits<{
    (e: 'update:showMetrics', value: boolean): void
    (e: 'update:showAnnotations', value: boolean): void
    (e: 'update:heightPerChannel', value: number): void
}>()

function toggleShowMetrics() {
    emit('update:showMetrics', !props.showMetrics)
}

function toggleShowAnnotations() {
    emit('update:showAnnotations', !props.showAnnotations)
}

function toggleSettingsPanel() {
    showSettings.value = !showSettings.value
}

function updateHeightPerChannel(event: Event) {
    const target = event.target as HTMLInputElement
    const nextValue = Number.parseInt(target.value, 10)
    if (Number.isFinite(nextValue) && nextValue > 0) {
        emit('update:heightPerChannel', nextValue)
    }
}

const showSettings = ref(false)

</script>

<template>
    <div class="settings">
        <div class="settings__header">
            <span class="settings__title">Settings</span>
            <button class="settings__toggle" type="button" :aria-expanded="showSettings"
                :aria-label="showSettings ? 'Hide settings panel' : 'Show settings panel'"
                :title="showSettings ? 'Hide settings panel' : 'Show settings panel'" @click="toggleSettingsPanel">
                <span class="settings__toggle-icon" aria-hidden="true"></span>
                <span class="settings__toggle-chevron" aria-hidden="true"></span>
            </button>
        </div>
        <div v-show="showSettings" class="settings__panel">
            <label class="settings__row" for="show-metrics-toggle">
                <span class="settings__label">Show metrics panel</span>
                <input id="show-metrics-toggle" class="settings__checkbox" type="checkbox" :checked="showMetrics"
                    @change="toggleShowMetrics">
            </label>

            <label class="settings__row" for="show-annotations-toggle">
                <span class="settings__label">Show annotations panel</span>
                <input id="show-annotations-toggle" class="settings__checkbox" type="checkbox"
                    :checked="showAnnotations" @change="toggleShowAnnotations">
            </label>

            <div class="settings__row settings__row--number">
                <label class="settings__label" for="height-per-channel-input">Height per channel</label>
                <input id="height-per-channel-input" class="settings__number" type="number" min="1" step="1"
                    :value="heightPerChannel" @change="updateHeightPerChannel">
            </div>
        </div>
    </div>
</template>

<style scoped>
.settings {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px;
    border-radius: 10px;
    border: 1px solid #334155;
    background: linear-gradient(180deg, #020617 0%, #000000 100%);
    color: #e2e8f0;
}

.settings__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.settings__title {
    font-size: 14px;
    letter-spacing: 0.4px;
    text-transform: uppercase;
    color: #cbd5e1;
    font-weight: 700;
}

.settings__toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    width: 42px;
    height: 32px;
    padding: 0;
    border-radius: 999px;
    border: 1px solid #475569;
    background: #0b1220;
    color: #bfdbfe;
    cursor: pointer;
    justify-content: center;
    transition: background-color 0.2s, border-color 0.2s, color 0.2s;
}

.settings__toggle:hover {
    background: #13203a;
    border-color: #64748b;
    color: #dbeafe;
}

.settings__toggle:focus-visible {
    outline: 2px solid #38bdf8;
    outline-offset: 2px;
}

.settings__toggle-icon {
    display: block;
    width: 15px;
    height: 15px;
    background-color: currentColor;
    -webkit-mask-image: url('../../../assets/icons/settings-gear.svg');
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    -webkit-mask-size: contain;
    mask-image: url('../../../assets/icons/settings-gear.svg');
    mask-repeat: no-repeat;
    mask-position: center;
    mask-size: contain;
}

.settings__toggle-chevron {
    display: block;
    width: 10px;
    height: 10px;
    background-color: currentColor;
    -webkit-mask-image: url('../../../assets/icons/chevron-down.svg');
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    -webkit-mask-size: contain;
    mask-image: url('../../../assets/icons/chevron-down.svg');
    mask-repeat: no-repeat;
    mask-position: center;
    mask-size: contain;
    transition: transform 0.2s;
}

.settings__toggle[aria-expanded='true'] .settings__toggle-chevron {
    transform: rotate(180deg);
}

.settings__panel {
    display: grid;
    gap: 10px;
    border-top: 1px solid #1e293b;
    padding-top: 10px;
}

.settings__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 32px;
}

.settings__label {
    font-size: 13px;
    color: #cbd5e1;
}

.settings__checkbox {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #38bdf8;
}

.settings__number {
    width: 90px;
    border-radius: 6px;
    border: 1px solid #475569;
    background: #0f172a;
    color: #e2e8f0;
    padding: 5px 8px;
    font-size: 13px;
}

.settings__number:focus-visible {
    outline: 2px solid #38bdf8;
    outline-offset: 1px;
}

@media (max-width: 700px) {
    .settings__row {
        flex-wrap: wrap;
        justify-content: flex-start;
    }

    .settings__number {
        width: 100%;
    }
}
</style>
