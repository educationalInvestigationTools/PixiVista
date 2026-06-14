import { MetricsState } from '@/metricsComponent/domain/metricsState'
import { MetricsObserver } from '@/metricsComponent/domain/metricsObserver'
import { AddPerformanceMetricsCommandEventLabel, type AddPerformanceMetricsCommand } from '@/metricsComponent/application/commands/addPerformanceMetricsCommand'
import { EventMediator } from '@/utils/eventMediator'
import { RenderManager } from '@/core/rendering/renderManager'
import { MetricsComponentApi } from '@/metricsComponent/domain/metricsComponentApi'
export class MetricsContainer {
    readonly eventMediator: EventMediator = new EventMediator()
    private metricsObserver?: MetricsObserver

    async init(htmlElement: HTMLElement) {
        const windowMs = 1000 * 60
        const renderManager = new RenderManager(htmlElement, this.eventMediator)
        const componentApi = new MetricsComponentApi(this.eventMediator, windowMs)
        await renderManager.init(componentApi.Component)
        const target = htmlElement.querySelector('canvas')
        target!.style.touchAction = 'auto'

        const state = new MetricsState(windowMs)
        this.metricsObserver = new MetricsObserver(state, componentApi)

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
