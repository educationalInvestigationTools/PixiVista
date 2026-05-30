<script setup lang="ts">

import { computed, ref } from 'vue';
import SettingsComponent from '@/presentation/settingsComponent/SettingsComponent.vue';
import type { AnyChoice, AnyUpdateChoice } from '@/presentation/settingsComponent/settingsChoice';
import { ChoiceTreeNode, type SettingsTreeNode, LabelTreeNode } from '@/presentation/settingsComponent/settingsTreeNodes';

type SettingsTreeBlueprintNode =
    | {
        kind: 'label'
        id: string
        label: string
        children: SettingsTreeBlueprintNode[]
    }
    | {
        kind: 'choice'
        id: string
        buildChoice: () => AnyChoice
    }


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

let settingsBlueprintId = 0

const randomSettingsGroupLabels = ['Bundle', 'Cluster', 'Section', 'Branch', 'Suite', 'Layer']

const settingsBlueprint = createRandomSettingsBlueprint()

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

function createRandomSettingsBlueprint(): SettingsTreeBlueprintNode[] {
    const groups = [
        createLabelBlueprint('Panels', createRandomizedBlueprintNodes([
            createChoiceBlueprint(showMetricsSettingId, () => ({
                id: showMetricsSettingId,
                label: 'Metrics',
                value: showMetricsPanel.value,
            })),
            createChoiceBlueprint(showAnnotationsSettingId, () => ({
                id: showAnnotationsSettingId,
                label: 'Annotations',
                value: showAnnotationsPanel.value,
            })),
        ])),
        createLabelBlueprint('View', createRandomizedBlueprintNodes([
            createLabelBlueprint('Grid', createRandomizedBlueprintNodes([
                createChoiceBlueprint(showGridLinesSettingId, () => ({
                    id: showGridLinesSettingId,
                    label: 'Grid lines',
                    value: showGridLines.value,
                })),
                createChoiceBlueprint(showTimeMarkersSettingId, () => ({
                    id: showTimeMarkersSettingId,
                    label: 'Time markers',
                    value: showTimeMarkers.value,
                })),
                createChoiceBlueprint(gridOpacitySettingId, () => ({
                    id: gridOpacitySettingId,
                    label: 'Grid opacity',
                    value: gridOpacity.value,
                    min: 0,
                    max: 1,
                    format: (value: number) => `${(value * 100).toFixed(0)}%`,
                })),
            ])),
            createLabelBlueprint('Labels', createRandomizedBlueprintNodes([
                createChoiceBlueprint(labelFontSizeSettingId, () => ({
                    id: labelFontSizeSettingId,
                    label: 'Label size',
                    value: labelFontSize.value,
                    min: 8,
                    max: 24,
                    format: (value: number) => `${value.toFixed(0)}px`,
                })),
            ])),
            createLabelBlueprint('Signal', createRandomizedBlueprintNodes([
                createChoiceBlueprint(scaleModeSettingId, () => ({
                    id: scaleModeSettingId,
                    label: 'Scale mode',
                    value: scaleMode.value,
                    options: ['Auto', 'Fixed', 'Adaptive'],
                })),
                createChoiceBlueprint(timeFormatSettingId, () => ({
                    id: timeFormatSettingId,
                    label: 'Time format',
                    value: timeFormat.value,
                    options: ['Samples', 'Seconds', 'HH:MM:SS'],
                })),
                createChoiceBlueprint(colorPaletteSettingId, () => ({
                    id: colorPaletteSettingId,
                    label: 'Palette',
                    value: colorPalette.value,
                    options: ['Neutral', 'Warm', 'Cool', 'High Contrast'],
                })),
            ])),
        ])),
        createLabelBlueprint('Behavior', createRandomizedBlueprintNodes([
            createChoiceBlueprint(enableSmoothingSettingId, () => ({
                id: enableSmoothingSettingId,
                label: 'Smoothing',
                value: enableSmoothing.value,
            })),
            createChoiceBlueprint(lockYAxisSettingId, () => ({
                id: lockYAxisSettingId,
                label: 'Lock Y axis',
                value: lockYAxis.value,
            })),
            createChoiceBlueprint(updateRateSettingId, () => ({
                id: updateRateSettingId,
                label: 'Update rate',
                value: updateRate.value,
                min: 15,
                max: 120,
                format: (value: number) => `${value.toFixed(0)}Hz`,
            })),
            createChoiceBlueprint(zoomFactorSettingId, () => ({
                id: zoomFactorSettingId,
                label: 'Zoom factor',
                value: zoomFactor.value,
                min: 0.5,
                max: 4,
                format: (value: number) => `${value.toFixed(2)}x`,
            })),
        ])),
        createLabelBlueprint('Style', createRandomizedBlueprintNodes([
            createChoiceBlueprint(heightPerChannelSettingId, () => ({
                id: heightPerChannelSettingId,
                label: 'Height / channel',
                value: heightPerChannel.value,
                min: 60,
                max: 600,
                format: (value: number) => `${value.toFixed(0)}px`,
            })),
            createChoiceBlueprint(lineThicknessSettingId, () => ({
                id: lineThicknessSettingId,
                label: 'Line thickness',
                value: lineThickness.value,
                min: 0.5,
                max: 6,
                format: (value: number) => `${value.toFixed(1)}px`,
            })),
            createChoiceBlueprint(themeSettingId, () => ({
                id: themeSettingId,
                label: 'Light theme',
                value: isLightTheme.value,
            })),
        ])),
    ]

    return createRandomizedBlueprintNodes(groups)
}

function createChoiceBlueprint(id: string, buildChoice: () => AnyChoice): SettingsTreeBlueprintNode {
    return {
        kind: 'choice',
        id,
        buildChoice,
    }
}

function createLabelBlueprint(label: string, children: SettingsTreeBlueprintNode[]): SettingsTreeBlueprintNode {
    return {
        kind: 'label',
        id: `settings-${slugify(label)}-${nextSettingsBlueprintId()}`,
        label,
        children,
    }
}

function createRandomizedBlueprintNodes(nodes: SettingsTreeBlueprintNode[], depth = 0): SettingsTreeBlueprintNode[] {
    if (nodes.length <= 2 || depth >= 2) {
        return [...nodes]
    }

    const bucketCount = randomInt(2, Math.min(4, nodes.length))
    const buckets = splitIntoBuckets(nodes, bucketCount)

    return buckets.map((bucket) => {
        if (bucket.length === 1) {
            return bucket[0]!
        }

        const nextChildren = depth === 1 ? bucket : createRandomizedBlueprintNodes(bucket, depth + 1)
        return createLabelBlueprint(pickRandom(randomSettingsGroupLabels), nextChildren)
    })
}

function splitIntoBuckets<T>(nodes: readonly T[], bucketCount: number): T[][] {
    const shuffledNodes = shuffleNodes(nodes)
    const buckets: T[][] = []
    let cursor = 0

    for (let bucketIndex = 0; bucketIndex < bucketCount; bucketIndex += 1) {
        const remainingValues = shuffledNodes.length - cursor
        const remainingBuckets = bucketCount - bucketIndex - 1
        const size = bucketIndex === bucketCount - 1 ? remainingValues : randomInt(1, remainingValues - remainingBuckets)
        buckets.push(shuffledNodes.slice(cursor, cursor + size))
        cursor += size
    }

    return buckets
}

function shuffleNodes<T>(nodes: readonly T[]): T[] {
    const result = [...nodes]

    for (let index = result.length - 1; index > 0; index -= 1) {
        const swapIndex = randomInt(0, index)
        const currentNode = result[index]!
        result[index] = result[swapIndex]!
        result[swapIndex] = currentNode
    }

    return result
}

function buildSettingsTreeNode(node: SettingsTreeBlueprintNode): SettingsTreeNode {
    if (node.kind === 'choice') {
        return new ChoiceTreeNode(node.buildChoice())
    }

    return new LabelTreeNode(node.id, node.label, node.children.map(buildSettingsTreeNode))
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickRandom<T>(values: readonly T[]): T {
    return values[randomInt(0, values.length - 1)]!
}

function slugify(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function nextSettingsBlueprintId(): number {
    settingsBlueprintId += 1
    return settingsBlueprintId
}

const settingsTrees = computed<SettingsTreeNode[]>(() => settingsBlueprint.map(buildSettingsTreeNode))

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
