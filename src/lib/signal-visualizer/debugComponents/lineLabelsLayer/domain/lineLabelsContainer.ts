import { RenderManager } from "@/lib/signal-visualizer/core/rendering/renderManager";
import { EventMediator } from "@/lib/signal-visualizer/utils/eventMediator";
import { LineLabelsApi } from "./lineLabelsApi";
import type { LineLayerDescription } from "@/lib/signal-visualizer/plotComponent/infrastructure/rendering/lineLabelsLayer/types/lineLayerDescription";
import { LineLabelsLayer } from "@/lib/signal-visualizer/plotComponent/infrastructure/rendering/lineLabelsLayer/lineLabelsLayer";

export class LineLabelsContainer {
    readonly eventMediator: EventMediator = new EventMediator()
    async init(htmlElement: HTMLElement) {
        const renderManager = new RenderManager(htmlElement, this.eventMediator)

        const description: LineLayerDescription = {
            positionsNormalized: [0, 0.3, 0.6, 1],
            orientation: 'vertical',
            alignmentCallback: (arg0: number, arg1: number) => 'center'
        }

        const component = new LineLabelsLayer(description)
        const componentApi = new LineLabelsApi(component, this.eventMediator)

        await renderManager.init(componentApi.Component)
    }
}
