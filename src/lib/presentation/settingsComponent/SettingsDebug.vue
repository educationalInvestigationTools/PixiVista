<script setup lang="ts">

import { computed, ref } from 'vue';
import SettingsComponent from '@/presentation/settingsComponent/SettingsComponent.vue';
import type { AnyChoice, AnyUpdateChoice } from '@/presentation/settingsComponent/settingsChoice';

const showMetricsPanel = ref(true)
const showAnnotationsPanel = ref(true)
const showGridLines = ref(true)
const showTimeMarkers = ref(false)
const enableSmoothing = ref(false)
const lockYAxis = ref(false)

const scaleMode = ref('Auto')
const timeFormat = ref('Samples')
const colorPalette = ref('Neutral')

const heightPerChannel = ref(100)
const lineThickness = ref(2)
const gridOpacity = ref(0.35)
const labelFontSize = ref(12)
const updateRate = ref(60)
const zoomFactor = ref(1.5)

const showMetricsSettingId = 'show-metrics-panel'
const showAnnotationsSettingId = 'show-annotations-panel'
const showGridLinesSettingId = 'show-grid-lines'
const showTimeMarkersSettingId = 'show-time-markers'
const enableSmoothingSettingId = 'enable-smoothing'
const lockYAxisSettingId = 'lock-y-axis'

const scaleModeSettingId = 'scale-mode'
const timeFormatSettingId = 'time-format'
const colorPaletteSettingId = 'color-palette'

const heightPerChannelSettingId = 'height-per-channel'
const lineThicknessSettingId = 'line-thickness'
const gridOpacitySettingId = 'grid-opacity'
const labelFontSizeSettingId = 'label-font-size'
const updateRateSettingId = 'update-rate'
const zoomFactorSettingId = 'zoom-factor'

const booleanSettingById: Record<string, { value: boolean }> = {
    [showMetricsSettingId]: showMetricsPanel,
    [showAnnotationsSettingId]: showAnnotationsPanel,
    [showGridLinesSettingId]: showGridLines,
    [showTimeMarkersSettingId]: showTimeMarkers,
    [enableSmoothingSettingId]: enableSmoothing,
    [lockYAxisSettingId]: lockYAxis,
}

const stringSettingById: Record<string, { value: string }> = {
    [scaleModeSettingId]: scaleMode,
    [timeFormatSettingId]: timeFormat,
    [colorPaletteSettingId]: colorPalette,
}

const numberSettingById: Record<string, { value: number }> = {
    [heightPerChannelSettingId]: heightPerChannel,
    [lineThicknessSettingId]: lineThickness,
    [gridOpacitySettingId]: gridOpacity,
    [labelFontSizeSettingId]: labelFontSize,
    [updateRateSettingId]: updateRate,
    [zoomFactorSettingId]: zoomFactor,
}

function applyUpdate(update: AnyUpdateChoice) {
    const booleanTarget = booleanSettingById[update.id]
    if (booleanTarget !== undefined) {
        booleanTarget.value = update.value as boolean
        return
    }

    const numberTarget = numberSettingById[update.id]
    if (numberTarget !== undefined) {
        numberTarget.value = update.value as number
        return
    }

    const stringTarget = stringSettingById[update.id]
    if (stringTarget !== undefined) {
        stringTarget.value = update.value as string
    }
}

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
        id: showGridLinesSettingId,
        label: 'Grid lines',
        value: showGridLines.value,
    },
    {
        id: showTimeMarkersSettingId,
        label: 'Time markers',
        value: showTimeMarkers.value,
    },
    {
        id: enableSmoothingSettingId,
        label: 'Smoothing',
        value: enableSmoothing.value,
    },
    {
        id: lockYAxisSettingId,
        label: 'Lock Y axis',
        value: lockYAxis.value,
    },
    {
        id: scaleModeSettingId,
        label: 'Scale mode',
        value: scaleMode.value,
        options: ['Auto', 'Fixed', 'Adaptive']
    },
    {
        id: timeFormatSettingId,
        label: 'Time format',
        value: timeFormat.value,
        options: ['Samples', 'Seconds', 'HH:MM:SS']
    },
    {
        id: colorPaletteSettingId,
        label: 'Palette',
        value: colorPalette.value,
        options: ['Neutral', 'Warm', 'Cool', 'High Contrast']
    },
    {
        id: heightPerChannelSettingId,
        label: 'Height / channel',
        value: heightPerChannel.value,
        min: 60,
        max: 600,
        format: (value: number) => value.toFixed(0) + 'px'
    },
    {
        id: lineThicknessSettingId,
        label: 'Line thickness',
        value: lineThickness.value,
        min: 0.5,
        max: 6,
        format: (value: number) => value.toFixed(1) + 'px'
    },
    {
        id: gridOpacitySettingId,
        label: 'Grid opacity',
        value: gridOpacity.value,
        min: 0,
        max: 1,
        format: (value: number) => (value * 100).toFixed(0) + '%'
    },
    {
        id: labelFontSizeSettingId,
        label: 'Label size',
        value: labelFontSize.value,
        min: 8,
        max: 24,
        format: (value: number) => value.toFixed(0) + 'px'
    },
    {
        id: updateRateSettingId,
        label: 'Update rate',
        value: updateRate.value,
        min: 15,
        max: 120,
        format: (value: number) => value.toFixed(0) + 'Hz'
    },
    {
        id: zoomFactorSettingId,
        label: 'Zoom factor',
        value: zoomFactor.value,
        min: 0.5,
        max: 4,
        format: (value: number) => value.toFixed(2) + 'x'
    },
])


</script>

<template>
    <SettingsComponent
        :choices="settingsChoices"
        @update:choice="applyUpdate">
    </SettingsComponent>
</template>

<style scoped></style>
