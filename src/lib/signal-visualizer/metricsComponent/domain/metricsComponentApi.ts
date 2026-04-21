import { RenderLayerDomainApi } from '@/lib/signal-visualizer/core/rendering/layerApi.ts'
import { MetricsComponentLayer } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/componentLayer/metricsComponentLayer.ts'
import { MetricsComponentLayout } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/componentLayer/layout.ts'
import type { EventMediator } from '@/lib/signal-visualizer/utils/eventMediator.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import {
    type MetricsSample,
    MetricsState,
} from '@/lib/signal-visualizer/metricsComponent/domain/metricsState.ts'
import {
    type AddPerformanceMetricsCommand,
    AddPerformanceMetricsCommandEventLabel,
} from '@/lib/signal-visualizer/metricsComponent/application/commands/addPerformanceMetricsCommand'
import type { MetricsChartsSnapshot } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/chartLayer/types/metricsChartSnapshot.ts'
import { clamp } from '@/lib/signal-visualizer/utils/utils.ts'
import type { PointsData } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/chartLayer/types/pointsData.ts'
import type { ChartValuePoint } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/chartLayer/types/chartValuePoint.ts'

export class MetricsComponentApi extends RenderLayerDomainApi<MetricsComponentLayer> {
    private static readonly RENDER_POINT_GROUPS = 120

    private readonly state: MetricsState

    constructor(sizeData: SizeData, eventMediator: EventMediator) {
        const windowMs = 1000 * 60
        const component = new MetricsComponentLayer(
            new MetricsComponentLayout(sizeData, {
                x: 0,
                y: 0,
            }),
            MetricsComponentApi.buildSnapshots([], windowMs),
        )
        super(component, eventMediator)
        this.state = new MetricsState(windowMs)
    }

    registerEvents(): void {
        this.eventMediator.addHandler<AddPerformanceMetricsCommand>(
            AddPerformanceMetricsCommandEventLabel,
            async (command) => this.addPerformanceMetrics(command),
        )
    }

    private async addPerformanceMetrics(command: AddPerformanceMetricsCommand) {
        const sample = {
            timestampMs: command.performanceMetrics.observedAt.getTime(),
            renderTimeMs: command.performanceMetrics.renderTimeMs,
            refreshRateFps: command.performanceMetrics.refreshRateFps,
        }
        const currentState = this.state.pushSample(sample)
        const windowMs = this.state.WindowMs
        this.component.updateCharts(MetricsComponentApi.buildSnapshots(currentState, windowMs))
    }

    private static buildSnapshots(
        samples: MetricsSample[],
        windowMs: number,
    ): MetricsChartsSnapshot {
        const refreshRatePointsData = this.buildWindowPoints(
            samples,
            windowMs,
            (sample) => sample.refreshRateFps,
        )
        const renderTimePointsData = this.buildWindowPoints(
            samples,
            windowMs,
            (sample) => sample.renderTimeMs,
        )
        return {
            refreshRateChart: {
                title: 'Refresh Rate',
                unit: 'FPS',
                points: refreshRatePointsData.points,
                minValue: refreshRatePointsData.minValue,
                maxValue: refreshRatePointsData.maxValue,
                currentValue: refreshRatePointsData.currentValue,
                lineColor: '#34d399',
                fillColor: '#14532d',
                gridColor: '#34d399',
            },
            renderTimeChart: {
                title: 'Render Time',
                unit: 'ms',
                points: renderTimePointsData.points,
                minValue: renderTimePointsData.minValue,
                maxValue: renderTimePointsData.maxValue,
                currentValue: renderTimePointsData.currentValue,
                lineColor: '#f59e0b',
                fillColor: '#78350f',
                gridColor: '#f59e0b',
            },
        }
    }

    private static buildWindowPoints(
        samples: MetricsSample[],
        windowMs: number,
        getValue: (sample: MetricsSample) => number,
    ): PointsData {

        if (samples.length === 0) {
            return {
                points: [
                    { x: 0, value: 0 },
                    { x: 1, value: 0 },
                ],
                minValue: 0,
                maxValue: 0,
                currentValue: 0,
            }
        }
        const latestTimestamp = samples[samples.length - 1]!.timestampMs
        const cutoff = latestTimestamp - windowMs
        const points = samples.map((sample) => ({
            x: clamp((sample.timestampMs - cutoff) / windowMs, 0, 1),
            value: Math.max(0, getValue(sample)),
        }))

        const averagedPoints = this.averagePointsByGroups(points, this.RENDER_POINT_GROUPS)

        const peakValue = averagedPoints.reduce((maxValue, point) => Math.max(maxValue, point.value), 0)
        const maxValue = Math.max(peakValue * 1.1, 1)
        const currentValue = points[points.length - 1]!.value
        return {
            points: averagedPoints,
            minValue: 0,
            maxValue: maxValue,
            currentValue: currentValue,
        }
    }

    private static averagePointsByGroups(
        points: ChartValuePoint[],
        groupsCount: number,
    ): ChartValuePoint[] {
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
            bucket.valueSum += point.value
            bucket.count += 1
        }

        const averagedPoints: ChartValuePoint[] = []
        for (const bucket of buckets) {
            if (bucket.count === 0) {
                continue
            }
            averagedPoints.push({
                x: bucket.xSum / bucket.count,
                value: bucket.valueSum / bucket.count,
            })
        }

        return averagedPoints.length > 0 ? averagedPoints : [points[points.length - 1]!]
    }
}
