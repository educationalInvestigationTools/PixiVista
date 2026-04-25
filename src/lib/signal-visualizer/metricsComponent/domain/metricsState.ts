import type { Point2D } from "../../core/types/Point2d"
import { clamp } from "../../utils/utils"
import type { MetricsPoints } from "../infrastructure/rendering/componentLayer/metricsComponentLayer"
import type { PointsData } from "./types/pointsData"

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
        return this.samples.length === 0 ? Date.now() : this.samples[this.samples.length - 1]!.timestampMs
    }

    get CurrentState() {
        return this.buildSnapshots()
    }

    private buildSnapshots(
    ): MetricsPoints {
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
            refreshRatePointsData, renderTimePointsData
        }
    }

    private downSamplingAlgorithm(points: Point2D[]): Point2D[] {
        const delta = 1 / (this.outputSamples - 1)
        const times = []
        const values: [number, number][] = []
        for (let i = 0; i < this.outputSamples; i++) {
            times.push(i * delta)
            values.push([0, 0])
        }
        for (const point of points) {
            let group = 0
            for (let i = 0; i < this.outputSamples; i++){
                if (Math.abs(point.x - times[group]!) > Math.abs(point.x - times[i]!)) {
                    group = i
                }
            }
            values[group]![0] += point.y
            values[group]![1]++
        }

        const result: Point2D[] = []
        for (let i = 0; i < this.outputSamples; i++) {
            const x = times[i]!
            const y = values[i]![1] === 0 ? 0 : values[i]![0] / values[i]![1]
            result.push({
                x, y
            })
        }
        return result
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
        const downSampledPoints = this.downSamplingAlgorithm(points)
        const maxValue = downSampledPoints.reduce((maxValue, point) => Math.max(maxValue, point.y), 0)
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
