import { RenderManager } from "@/core/rendering/renderManager"
import { LineLabelsApi } from "@/debugComponents/lineLabelsLayer/domain/lineLabelsApi"
import { LineLabelsLayer } from "@/infrastructure/rendering/lineLabelsLayer/lineLabelsLayer"
import type { LineLayerDescription } from "@/infrastructure/rendering/lineLabelsLayer/types/lineLayerDescription"
import { EventMediator } from "@/utils/eventMediator"

export class LineLabelsContainer {
    readonly eventMediator: EventMediator = new EventMediator()
    async init(htmlElement: HTMLElement) {
        const renderManager = new RenderManager(htmlElement, this.eventMediator)

        const description: LineLayerDescription = {
            positionsNormalized: [0, 0.3, 0.6, 1],
            orientation: 'vertical',
            alignmentCallback: (_arg0: number, _arg1: number) => 'center',
        }

        const component = new LineLabelsLayer(description)
        const componentApi = new LineLabelsApi(component, this.eventMediator)

        await renderManager.init(componentApi.Component)
    }
}
