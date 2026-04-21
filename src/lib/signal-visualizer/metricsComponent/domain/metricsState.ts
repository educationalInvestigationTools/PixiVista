import type {
    MetricsChartSnapshot,
    MetricsChartsSnapshot,
} from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/chartLayer/types/metricsChartSnapshot'
import type { MetricsSample } from '@/lib/signal-visualizer/metricsComponent/application/types/metricsSample.ts'
import type { ChartValuePoint } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/chartLayer/types/chartValuePoint'
import { clamp } from '../../utils/utils'


type MetricSeriesBuildData = {
    title: string
    unit: string
    defaultMaxValue: number
    lineColor: string
    fillColor: string
    gridColor: string
    getValue: (sample: MetricsSample) => number
}

export class MetricsState {
    private samples: MetricsSample[] = []
    private windowMs: number

    constructor(windowMs: number) {
        this.windowMs = windowMs
    }

    pushSample(sample: MetricsSample) {
        this.samples.push(sample)
        this.trimSamples(sample.timestampMs)
    }

    buildSnapshots(): MetricsChartsSnapshot {
        return {
            refreshRateChart: this.buildChartSnapshot({
                title: 'Refresh Rate',
                unit: 'FPS',
                defaultMaxValue: 60,
                lineColor: '#34d399',
                fillColor: '#14532d',
                gridColor: '#34d399',
                getValue: (sample) => sample.refreshRateFps,
            }),
            renderTimeChart: this.buildChartSnapshot({
                title: 'Render Time',
                unit: 'ms',
                defaultMaxValue: 16,
                lineColor: '#f59e0b',
                fillColor: '#78350f',
                gridColor: '#f59e0b',
                getValue: (sample) => sample.renderTimeMs,
            }),
        }
    }

    private trimSamples(referenceTimestampMs?: number) {
        if (this.samples.length === 0) {
            return
        }
        const latestTimestamp =
            referenceTimestampMs !== undefined
                ? referenceTimestampMs
                : this.samples[this.samples.length - 1]!.timestampMs
        const cutoff = latestTimestamp - this.windowMs
        while (this.samples.length > 0 && this.samples[0]!.timestampMs < cutoff) {
            this.samples.shift()
        }
    }

    private buildChartSnapshot(buildData: MetricSeriesBuildData): MetricsChartSnapshot {
        const points = this.buildWindowPoints(buildData.getValue)
        const peakValue = points.reduce((maxValue, point) => Math.max(maxValue, point.value), 0)
        const maxValue = Math.max(buildData.defaultMaxValue, peakValue * 1.1, 1)
        const currentValue = points[points.length - 1]!.value

        return {
            title: buildData.title,
            unit: buildData.unit,
            points,
            minValue: 0,
            maxValue,
            currentValue,
            lineColor: buildData.lineColor,
            fillColor: buildData.fillColor,
            gridColor: buildData.gridColor,
        }
    }

    private buildWindowPoints(getValue: (sample: MetricsSample) => number): ChartValuePoint[] {
        if (this.samples.length === 0) {
            return [
                { x: 0, value: 0 },
                { x: 1, value: 0 },
            ]
        }

        const latestTimestamp = this.samples[this.samples.length - 1]!.timestampMs
        const cutoff = latestTimestamp - this.windowMs
        const points = this.samples.map((sample) => ({
            x: clamp((sample.timestampMs - cutoff) / this.windowMs, 0, 1),
            value: Math.max(0, getValue(sample)),
        }))

        if (points.length === 1) {
            const point = points[0]!
            return [
                { x: 0, value: point.value },
                { x: point.x, value: point.value },
            ]
        }

        return points
    }
}

