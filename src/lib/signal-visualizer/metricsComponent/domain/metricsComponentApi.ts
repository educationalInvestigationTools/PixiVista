import { RenderLayerDomainApi } from '@/lib/signal-visualizer/core/rendering/layerApi.ts'
import { MetricsComponentLayer } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/componentLayer/metricsComponentLayer.ts'
import type { EventMediator } from '@/lib/signal-visualizer/utils/eventMediator.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import {
    MetricsState,
} from '@/lib/signal-visualizer/metricsComponent/domain/metricsState.ts'
import {
    type AddPerformanceMetricsCommand,
    AddPerformanceMetricsCommandEventLabel,
} from '@/lib/signal-visualizer/metricsComponent/application/commands/addPerformanceMetricsCommand'
import {
    MetricsComponentLayout
} from "@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/componentLayer/metricsComponentLayout.ts";

export class MetricsComponentApi extends RenderLayerDomainApi<MetricsComponentLayer> {
    private readonly state: MetricsState
    constructor(sizeData: SizeData, eventMediator: EventMediator) {
        const windowMs = 1000 * 60
        const refreshRateStyle = {
            title: 'Refresh Rate',
            unit: 'FPS',
            lineColor: '#34d399',
            fillColor: '#14532d',
            gridColor: '#34d399',
        }

        const renderTimeStyle = {
            title: 'Render Time',
            unit: 'ms',
            lineColor: '#f59e0b',
            fillColor: '#78350f',
            gridColor: '#f59e0b',
        }

        const [refreshTimePointsData, renderTimePointsData] = MetricsState.buildSnapshots([], windowMs)

        const component = new MetricsComponentLayer(
            new MetricsComponentLayout(sizeData, {
                x: 0,
                y: 0,
            }), refreshRateStyle, refreshTimePointsData, renderTimeStyle,


            renderTimePointsData,
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
        this.component.updateCharts(...MetricsState.buildSnapshots(currentState, windowMs))
    }
}
