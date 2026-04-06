<script setup lang="ts">
import PlotComponent from './PlotComponent.vue'
import { TestSignalSource } from '../../infrastructure/signals/testSampledSignal.ts'
import type { IntervalGroup } from '../../application/types/highlightedInterval.ts'
import type { SignalSource } from '../../application/types/signalSource.ts'

const signalSources: SignalSource[] = [
	new TestSignalSource('Fpz-Cz', 128, 180),
	new TestSignalSource('Pz-Oz', 128, 180),
	new TestSignalSource('EOG', 64, 180),
]

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
	signalSources,
	annotations,
}
</script>

<template>
	<PlotComponent v-bind="mockPlotProps" />
</template>

<style scoped></style>
