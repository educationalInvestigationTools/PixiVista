import { EventMediator } from '@/lib/signal-visualizer/utils/eventMediator.ts'
import { RenderManager } from '@/lib/signal-visualizer/core/rendering/renderManager.ts'
import { MetricsComponentApi } from '@/lib/signal-visualizer/metricsComponent/core/metricsComponentApi.ts'
import { DEFAULT_ROLLING_WINDOW_MS } from '@/lib/signal-visualizer/metricsComponent/application/types/rollingWindowConfig.ts'

export class MetricsContainer {
    readonly eventMediator: EventMediator

    constructor() {
        this.eventMediator = new EventMediator()
    }

    async init(htmlElement: HTMLElement, rollingWindowMs: number = DEFAULT_ROLLING_WINDOW_MS) {
        const renderManager = new RenderManager(htmlElement, this.eventMediator)
        const componentApi = new MetricsComponentApi(
            renderManager.sizeData,
            this.eventMediator,
            rollingWindowMs,
        )

        await renderManager.init(componentApi.Component)
    }
}
