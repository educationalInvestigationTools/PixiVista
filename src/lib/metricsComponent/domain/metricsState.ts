import { clamp } from '@/utils/utils'
import type { PointsData } from '@/metricsComponent/domain/types/pointsData'
import type { MetricsPoints } from '@/metricsComponent/domain/types/metricsPoints'

export type MetricsSample = {
    timestampMs: number
    renderTimeMs: number
    refreshRateFps: number
}

export class MetricsState {
    private samples: MetricsSample[] = []
    private readonly windowMs: number
    private readonly bucket: MetricsSample[] = []
    private readonly bucketMaxSize = 5

    constructor(windowMs: number) {
        this.windowMs = windowMs
    }

    processBucket() {
        if (this.bucket.length !== this.bucketMaxSize) {
            return
        }
        let index1 = 0
        let index2 = 0
        for (let i = 0; i < this.bucketMaxSize; i++) {
            if (this.bucket[i]!.refreshRateFps < this.bucket[index1]!.refreshRateFps) {
                index1 = i
            }
            if (this.bucket[i]!.renderTimeMs > this.bucket[index2]!.renderTimeMs) {
                index2 = i
            }
        }
        if (index1 !== index2) {
            this.samples.push(this.bucket[Math.min(index1, index2)]!, this.bucket[Math.max(index2, index1)]!)
        } else {
            this.samples.push(this.bucket[index1]!)
        }
        while (this.bucket.length > 0) {
            this.bucket.pop()
        }
    }

    pushSample(sample: MetricsSample) {
        this.bucket.push(sample)
        this.processBucket()
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


        const pointsToUse = points
        const maxValue = pointsToUse.reduce(
            (maxValue, point) => Math.max(maxValue, point.y),
            0,
        )
        const currentValue = pointsToUse[pointsToUse.length - 1]!.y
        return {
            points: pointsToUse,
            minValue: 0,
            maxValue: maxValue,
            currentValue: currentValue,
        }
    }
}
