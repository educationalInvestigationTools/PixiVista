<script setup lang="ts">
import { computed, ref } from 'vue';
import SettingsComponent from './lib/signal-visualizer/presentation/SettingsComponent.vue';
import type { AnySettingChoice } from './lib/signal-visualizer/presentation/types/settingsChoice';


const showMetricsPanel = ref(true)
const showAnnotationsPanel = ref(true)
const showMetricsSettingId = 'show-metrics-panel'
const showAnnotationsSettingId = 'show-annotations-panel'
const heightPerChannelSettingId = 'height-per-channel'

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
        value: 100,
        min: 60,
        max: 600,
        step: 10,
    }])


</script>


<template>
    <SettingsComponent :choices="settingsChoices"></SettingsComponent>
</template>

<style scoped></style>
