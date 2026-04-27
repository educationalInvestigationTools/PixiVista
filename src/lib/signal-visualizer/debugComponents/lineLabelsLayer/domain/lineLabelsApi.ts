import { RenderLayerDomainApi } from "@/lib/signal-visualizer/core/rendering/layerApi";
import type { LineLabelsLayer } from "@/lib/signal-visualizer/plotComponent/infrastructure/rendering/lineLabelsLayer/lineLabelsLayer";
import type { EventMediator } from "@/lib/signal-visualizer/utils/eventMediator";

export class LineLabelsApi extends RenderLayerDomainApi<LineLabelsLayer> {
    constructor(lineLabelsLayer : LineLabelsLayer, eventMediator : EventMediator) {
        super(lineLabelsLayer, eventMediator)
    }
    registerEvents(): void {

    }

}
