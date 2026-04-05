<script setup lang="ts">

import { computed, ref } from 'vue';
import type { AnySettingChoice } from './settingsChoice';
import SettingsComponent from '../settingsComponent/SettingsComponent.vue';

const showMetricsPanel = ref(true)
const showAnnotationsPanel = ref(true)
const showMetricsSettingId = 'show-metrics-panel'
const showAnnotationsSettingId = 'show-annotations-panel'
const heightPerChannelSettingId = 'height-per-channel'

const heightValue = ref(100)

const settingsChoices = computed<AnySettingChoice[]>(() => [
    {
        id: showMetricsSettingId,
        label: 'Metrics',
        value: showMetricsPanel.value,
    },
    {
        id: showAnnotationsSettingId,
        label: 'Annotations',
        value: showAnnotationsPanel.value,
    },
    {
        id: heightPerChannelSettingId,
        label: 'Height / channel',
        value: heightValue.value,
        min: 60,
        max: 600,
        step: 10,
        toString: (arg0: number) => arg0.toFixed(2) + 'px'
    }])


</script>

<template>
    <SettingsComponent :choices="settingsChoices"
        @update:choice="(update) => { if (update.id === heightPerChannelSettingId) { heightValue = update.value as number } }">
    </SettingsComponent>
</template>

<style scoped></style>
