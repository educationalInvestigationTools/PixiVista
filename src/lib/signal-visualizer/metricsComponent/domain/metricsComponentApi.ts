import { RenderLayerDomainApi } from '@/lib/signal-visualizer/core/rendering/layerApi.ts'
import { MetricsComponentLayer } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/componentLayer/metricsComponentLayer.ts'
import { MetricsComponentLayout } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/componentLayer/layout.ts'
import type { EventMediator } from '@/lib/signal-visualizer/utils/eventMediator.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import { MetricsState } from '@/lib/signal-visualizer/metricsComponent/domain/metricsState.ts'
import {
    AddPerformanceMetricsCommandEventLabel,
    type AddPerformanceMetricsCommand,
} from '@/lib/signal-visualizer/metricsComponent/application/commands/addPerformanceMetricsCommand'

export class MetricsComponentApi extends RenderLayerDomainApi<MetricsComponentLayer> {
    private readonly state: MetricsState

    constructor(sizeData: SizeData, eventMediator: EventMediator) {
        const state = new MetricsState(1000 * 60)
        const component = new MetricsComponentLayer(
            new MetricsComponentLayout(sizeData, {
                x: 0,
                y: 0,
            }),
            state.buildSnapshots(),
        )
        super(component, eventMediator)
        this.state = state
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
            refreshRateFps: command.performanceMetrics.refreshRateFps
        }
        this.state.pushSample(sample)
        this.component.updateCharts(this.state.buildSnapshots())
    }
}
