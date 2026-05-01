<script setup lang="ts">
import { SignalSourceManager, type SignalSourceBuildData } from '@/plotComponent/application/interfaces/signalSource'
import type { IntervalGroup } from '@/plotComponent/application/types/highlightedInterval'
import { MockSignalSerializer, MockSignalSourceConstructor } from '@/plotComponent/infrastructure/signals/mockSignalSource'
import PlotComponent from '@/plotComponent/presentation/plotComponent/PlotComponent.vue'



const signalSourcesBuildData: SignalSourceBuildData[] = [
    new MockSignalSourceConstructor(128, 180, 'Fpz-Cz'),
    new MockSignalSourceConstructor(128, 180, 'Pz-Oz'),
    new MockSignalSourceConstructor(64, 180, 'EOG')
]

const signalSourceSerializer = new MockSignalSerializer()

const manager = new SignalSourceManager()
manager.addSerializer(signalSourceSerializer)
signalSourcesBuildData.map(x => manager.addSignalBuildData(signalSourceSerializer.serializerId, x))

const annotations: Record<string, IntervalGroup> = {
    'Sleep Stages': {
        label: 'Sleep Stages',
        priority: 1,
        intervals: [
            {
                startSeconds: 5,
                endSeconds: 28,
                label: 'N1',
                signalsAssociated: ['Fpz-Cz', 'Pz-Oz'],
                drawingColor: '#f59e0b',
                drawingStyle: 'background-rectangle',
                hoverInfo: {
                    stage: 'N1',
                    confidence: '0.78',
                },
            },
            {
                startSeconds: 35,
                endSeconds: 72,
                label: 'N2',
                signalsAssociated: ['Fpz-Cz', 'Pz-Oz', 'EOG'],
                drawingColor: '#3b82f6',
                drawingStyle: 'background-rectangle',
                hoverInfo: {
                    stage: 'N2',
                    confidence: '0.91',
                },
            },
        ],
    },
    Artifacts: {
        label: 'Artifacts',
        priority: 2,
        intervals: [
            {
                startSeconds: 82,
                endSeconds: 89,
                label: 'Blink',
                signalsAssociated: ['EOG'],
                drawingColor: '#ef4444',
                drawingStyle: 'borders',
                hoverInfo: {
                    type: 'Eye blink',
                    severity: 'medium',
                },
            },
        ],
    },
}

const mockPlotProps = {
    workerCallback: () => new Worker(
        new URL('./workerScript.ts', import.meta.url),
        {type: 'module'}
    ),
    signalSourcesManager: manager,
    annotations: annotations,
}
</script>

<template>
    <PlotComponent v-bind="mockPlotProps"/>
</template>

<style scoped></style>
