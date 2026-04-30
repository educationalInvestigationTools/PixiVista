import { EventMediator } from '@/lib/signal-visualizer/utils/eventMediator.ts'
import { RenderManager } from '@/lib/signal-visualizer/core/rendering/renderManager.ts'
import { MetricsComponentApi } from '@/lib/signal-visualizer/metricsComponent/domain/metricsComponentApi.ts'
import { MetricsState } from './metricsState'
import { MetricsObserver } from './metricsObserver'
import { AddPerformanceMetricsCommandEventLabel, type AddPerformanceMetricsCommand } from '../application/commands/addPerformanceMetricsCommand'
export class MetricsContainer {
    readonly eventMediator: EventMediator = new EventMediator()
    private metricsObserver? : MetricsObserver

    async init(htmlElement: HTMLElement) {
        const windowMs = 1000 * 60
        const renderManager = new RenderManager(htmlElement, this.eventMediator)
        const componentApi = new MetricsComponentApi(this.eventMediator, windowMs)
        await renderManager.init(componentApi.Component)

        const state = new MetricsState(windowMs)
        this.metricsObserver = new MetricsObserver( state, componentApi )

        this.eventMediator.addHandler<AddPerformanceMetricsCommand>(
            AddPerformanceMetricsCommandEventLabel,
            async (command) => {
                const sample = {
                    timestampMs: command.performanceMetrics.observedAt.getTime(),
                    renderTimeMs: command.performanceMetrics.renderTimeMs,
                    refreshRateFps: command.performanceMetrics.refreshRateFps,
                }
                state.pushSample(sample)
            },
        )
        await this.metricsObserver.init()
    }
}
