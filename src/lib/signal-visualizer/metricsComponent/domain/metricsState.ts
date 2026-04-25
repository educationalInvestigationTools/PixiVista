import { clamp } from '../../utils/utils'
import { downSamplingAlgorithm } from '../utils/downSamplingAlgorithm'
import type { PointsData } from './types/pointsData'
import type { MetricsPoints } from '@/lib/signal-visualizer/metricsComponent/domain/types/metricsPoints.ts'

export type MetricsSample = {
    timestampMs: number
    renderTimeMs: number
    refreshRateFps: number
}

export class MetricsState {
    private samples: MetricsSample[] = []
    private readonly windowMs: number
    private readonly outputSamples: number

    constructor(windowMs: number, outputSamples = 200) {
        this.windowMs = windowMs
        this.outputSamples = outputSamples
    }

    pushSample(sample: MetricsSample) {
        this.samples.push(sample)
        this.trimSamples()
    }

    private trimSamples() {
        if (this.samples.length === 0) {
            return
        }
        const latestTimestamp = this.samples[this.samples.length - 1]!.timestampMs
        const cutoff = latestTimestamp - this.windowMs
        while (this.samples.length > 0 && this.samples[0]!.timestampMs < cutoff) {
            this.samples.shift()
        }
    }

    get TimeStampMs() {
        return this.samples.length === 0
            ? Date.now()
            : this.samples[this.samples.length - 1]!.timestampMs
    }

    get CurrentState() {
        return this.buildSnapshots()
    }

    private buildSnapshots(): MetricsPoints {
        const samples = this.samples
        const refreshRatePointsData = this.buildWindowPoints(
            samples,
            (sample) => sample.refreshRateFps,
        )
        const renderTimePointsData = this.buildWindowPoints(
            samples,
            (sample) => sample.renderTimeMs,
        )
        return {
            refreshRatePointsData,
            renderTimePointsData,
        }
    }

    private buildWindowPoints(
        samples: MetricsSample[],
        getValue: (sample: MetricsSample) => number,
    ): PointsData {
        if (samples.length === 0) {
            return {
                points: [
                    { x: 0, y: 0 },
                    { x: 1, y: 0 },
                ],
                minValue: 0,
                maxValue: 0,
                currentValue: 0,
            }
        }

        const latestTimestamp = samples[samples.length - 1]!.timestampMs
        const cutoff = latestTimestamp - this.windowMs
        const points = samples.map((sample) => ({
            x: clamp((sample.timestampMs - cutoff) / this.windowMs, 0, 1),
            y: getValue(sample),
        }))
        const downSampledPoints = downSamplingAlgorithm(points, this.outputSamples, {
            min: 0,
            max: 1,
        })
        const maxValue = downSampledPoints.reduce(
            (maxValue, point) => Math.max(maxValue, point.y),
            0,
        )
        const currentValue = downSampledPoints[downSampledPoints.length - 1]!.y
        console.log(downSampledPoints.length)
        return {
            points: downSampledPoints,
            minValue: 0,
            maxValue: maxValue,
            currentValue: currentValue,
        }
    }
}
