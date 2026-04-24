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
    private readonly RENDER_POINT_GROUPS = 120
    private samples: MetricsSample[] = []
    private readonly windowMs: number

    constructor(windowMs: number) {
        this.windowMs = windowMs
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

    get WindowMs() {
        return this.windowMs
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
            y: Math.max(0, getValue(sample)),
        }))

        const averagedPoints = this.averagePointsByGroups(points, this.RENDER_POINT_GROUPS)

        const peakValue = averagedPoints.reduce((maxValue, point) => Math.max(maxValue, point.y), 0)
        const maxValue = Math.max(peakValue * 1.1, 1)
        const currentValue = points[points.length - 1]!.y
        return {
            points: averagedPoints,
            minValue: 0,
            maxValue: maxValue,
            currentValue: currentValue,
        }
    }

    private averagePointsByGroups(
        points: Point2D[],
        groupsCount: number,
    ): Point2D[] {
        const safeGroupsCount = Math.max(1, groupsCount)
        if (points.length <= safeGroupsCount) {
            return points
        }

        const buckets = Array.from({ length: safeGroupsCount }, () => ({
            xSum: 0,
            valueSum: 0,
            count: 0,
        }))

        for (const point of points) {
            const bucketIndex = Math.min(
                safeGroupsCount - 1,
                Math.floor(clamp(point.x, 0, 1) * safeGroupsCount),
            )
            const bucket = buckets[bucketIndex]!
            bucket.xSum += point.x
            bucket.valueSum += point.y
            bucket.count += 1
        }

        const averagedPoints: Point2D[] = []
        for (const bucket of buckets) {
            if (bucket.count === 0) {
                continue
            }
            averagedPoints.push({
                x: bucket.xSum / bucket.count,
                y: bucket.valueSum / bucket.count,
            })
        }

        return averagedPoints.length > 0 ? averagedPoints : [points[points.length - 1]!]
    }
}
