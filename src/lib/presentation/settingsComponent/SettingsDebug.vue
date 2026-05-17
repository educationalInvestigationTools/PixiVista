<script setup lang="ts">

import { computed, ref } from 'vue';
import SettingsComponent from '@/presentation/settingsComponent/SettingsComponent.vue';
import {
    ChoiceTreeNode,
    LabelTreeNode,
    type AnyUpdateChoice,
    type SettingsTreeNode,
} from '@/presentation/settingsComponent/settingsChoice';

const showMetricsPanel = ref(true)
const showAnnotationsPanel = ref(true)
const showGridLines = ref(true)
const showTimeMarkers = ref(false)
const enableSmoothing = ref(false)
const lockYAxis = ref(false)
const isLightTheme = ref(getInitialTheme())

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
const themeSettingId = 'theme-light'

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
    [themeSettingId]: isLightTheme,
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
        if (update.id === themeSettingId) {
            applyTheme(update.value as boolean)
        }
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

const settingsTrees = computed<SettingsTreeNode[]>(() => [
    new LabelTreeNode('panel-settings', 'Panels', [
        new ChoiceTreeNode({
            id: showMetricsSettingId,
            label: 'Metrics',
            value: showMetricsPanel.value,
        }),
        new ChoiceTreeNode({
            id: showAnnotationsSettingId,
            label: 'Annotations',
            value: showAnnotationsPanel.value,
        }),
    ]),
    new LabelTreeNode('view-settings', 'View', [
        new LabelTreeNode('grid-settings', 'Grid', [
            new ChoiceTreeNode({
                id: showGridLinesSettingId,
                label: 'Grid lines',
                value: showGridLines.value,
            }),
            new ChoiceTreeNode({
                id: showTimeMarkersSettingId,
                label: 'Time markers',
                value: showTimeMarkers.value,
            }),
            new ChoiceTreeNode({
                id: gridOpacitySettingId,
                label: 'Grid opacity',
                value: gridOpacity.value,
                min: 0,
                max: 1,
                format: (value: number) => (value * 100).toFixed(0) + '%',
            }),
        ]),
        new LabelTreeNode('labels-settings', 'Labels', [
            new ChoiceTreeNode({
                id: labelFontSizeSettingId,
                label: 'Label size',
                value: labelFontSize.value,
                min: 8,
                max: 24,
                format: (value: number) => value.toFixed(0) + 'px',
            }),
        ]),
        new LabelTreeNode('signal-settings', 'Signal', [
            new ChoiceTreeNode({
                id: scaleModeSettingId,
                label: 'Scale mode',
                value: scaleMode.value,
                options: ['Auto', 'Fixed', 'Adaptive'],
            }),
            new ChoiceTreeNode({
                id: timeFormatSettingId,
                label: 'Time format',
                value: timeFormat.value,
                options: ['Samples', 'Seconds', 'HH:MM:SS'],
            }),
            new ChoiceTreeNode({
                id: colorPaletteSettingId,
                label: 'Palette',
                value: colorPalette.value,
                options: ['Neutral', 'Warm', 'Cool', 'High Contrast'],
            }),
        ]),
    ]),
    new LabelTreeNode('behavior-settings', 'Behavior', [
        new ChoiceTreeNode({
            id: enableSmoothingSettingId,
            label: 'Smoothing',
            value: enableSmoothing.value,
        }),
        new ChoiceTreeNode({
            id: lockYAxisSettingId,
            label: 'Lock Y axis',
            value: lockYAxis.value,
        }),
        new ChoiceTreeNode({
            id: updateRateSettingId,
            label: 'Update rate',
            value: updateRate.value,
            min: 15,
            max: 120,
            format: (value: number) => value.toFixed(0) + 'Hz',
        }),
        new ChoiceTreeNode({
            id: zoomFactorSettingId,
            label: 'Zoom factor',
            value: zoomFactor.value,
            min: 0.5,
            max: 4,
            format: (value: number) => value.toFixed(2) + 'x',
        }),
    ]),
    new LabelTreeNode('style-settings', 'Style', [
        new ChoiceTreeNode({
            id: heightPerChannelSettingId,
            label: 'Height / channel',
            value: heightPerChannel.value,
            min: 60,
            max: 600,
            format: (value: number) => value.toFixed(0) + 'px',
        }),
        new ChoiceTreeNode({
            id: lineThicknessSettingId,
            label: 'Line thickness',
            value: lineThickness.value,
            min: 0.5,
            max: 6,
            format: (value: number) => value.toFixed(1) + 'px',
        }),
        new ChoiceTreeNode({
            id: themeSettingId,
            label: 'Light theme',
            value: isLightTheme.value,
        }),
    ]),
])

function getInitialTheme() {
    if (typeof document === 'undefined') {
        return false
    }
    return document.documentElement.getAttribute('data-theme') === 'light'
}

function applyTheme(isLight: boolean) {
    if (typeof document === 'undefined') {
        return
    }
    if (isLight) {
        document.documentElement.setAttribute('data-theme', 'light')
    } else {
        document.documentElement.removeAttribute('data-theme')
    }
}


</script>

<template>
    <SettingsComponent
        :trees="settingsTrees"
        @update:choice="applyUpdate">
    </SettingsComponent>
</template>

<style scoped></style>
