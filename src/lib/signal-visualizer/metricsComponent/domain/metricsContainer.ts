import { EventMediator } from '@/lib/signal-visualizer/utils/eventMediator.ts'
import { RenderManager } from '@/lib/signal-visualizer/core/rendering/renderManager.ts'
import { MetricsComponentApi } from '@/lib/signal-visualizer/metricsComponent/domain/metricsComponentApi.ts'
export class MetricsContainer {
    readonly eventMediator: EventMediator = new EventMediator()

    async init(htmlElement: HTMLElement) {
        const renderManager = new RenderManager(htmlElement, this.eventMediator)
        const componentApi = new MetricsComponentApi(renderManager.sizeData, this.eventMediator)
        await renderManager.init(componentApi.Component)
    }
}
