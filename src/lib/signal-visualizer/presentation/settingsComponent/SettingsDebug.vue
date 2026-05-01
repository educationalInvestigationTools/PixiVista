<script setup lang="ts">

import {computed, ref} from 'vue';
import SettingsComponent from './SettingsComponent.vue';
import type { AnyChoice } from '@/lib/signal-visualizer/presentation/settingsComponent/settingsChoice';

const showMetricsPanel = ref(true)
const showAnnotationsPanel = ref(true)
const showMetricsSettingId = 'show-metrics-panel'
const showAnnotationsSettingId = 'show-annotations-panel'
const heightPerChannelSettingId = 'height-per-channel'

const heightValue = ref(100)

const settingsChoices = computed<AnyChoice[]>(() => [
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
        format: (arg0: number) => arg0.toFixed(2) + 'px'
    }])


</script>

<template>
    <SettingsComponent :choices="settingsChoices"
                       @update:choice="(update) => { if (update.id === heightPerChannelSettingId) { heightValue = update.value as number } }">
    </SettingsComponent>
</template>

<style scoped></style>
