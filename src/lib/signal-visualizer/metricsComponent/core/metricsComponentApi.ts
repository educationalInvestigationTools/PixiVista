import { RenderLayerDomainApi } from '@/lib/signal-visualizer/core/rendering/layerApi.ts'
import { MetricsComponentLayer } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/componentLayer/metricsComponentLayer.ts'
import { MetricsComponentLayout } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/componentLayer/layout.ts'
import type { EventMediator } from '@/lib/signal-visualizer/utils/eventMediator.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import { MetricsState } from '@/lib/signal-visualizer/metricsComponent/core/metricsState.ts'
import {
    AppendPerformanceMetricsCommandEventLabel,
    type AppendPerformanceMetricsCommand,
} from '@/lib/signal-visualizer/metricsComponent/application/commands/appendPerformanceMetricsCommand.ts'
import {
    ChangeRollingWindowMsCommandEventLabel,
    type ChangeRollingWindowMsCommand,
} from '@/lib/signal-visualizer/metricsComponent/application/commands/changeRollingWindowMsCommand.ts'
import {
    ResizeCommandEventLabel,
    type ResizeCommand,
} from '@/lib/signal-visualizer/application/commands/resizeCommand.ts'
import { buildMetricsSample } from '@/lib/signal-visualizer/metricsComponent/application/types/metricsSample.ts'

export class MetricsComponentApi extends RenderLayerDomainApi<MetricsComponentLayer> {
    private readonly state: MetricsState

    constructor(sizeData: SizeData, eventMediator: EventMediator, rollingWindowMs: number) {
        const state = new MetricsState(rollingWindowMs)
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
        this.eventMediator.addHandler<AppendPerformanceMetricsCommand>(
            AppendPerformanceMetricsCommandEventLabel,
            async (command) => this.appendPerformanceMetrics(command),
        )

        this.eventMediator.addHandler<ChangeRollingWindowMsCommand>(
            ChangeRollingWindowMsCommandEventLabel,
            async (command) => this.changeWindow(command),
        )

        this.eventMediator.addHandler<ResizeCommand>(ResizeCommandEventLabel, async (command) =>
            this.component.updateSize(command.sizeData),
        )
    }

    private async appendPerformanceMetrics(command: AppendPerformanceMetricsCommand) {
        const sample = buildMetricsSample(command.performanceMetrics, command.timestampMs)
        this.state.pushSample(sample)
        this.component.updateCharts(this.state.buildSnapshots())
    }

    private async changeWindow(command: ChangeRollingWindowMsCommand) {
        this.state.setWindowMs(command.windowMs)
        this.component.updateCharts(this.state.buildSnapshots())
    }
}
