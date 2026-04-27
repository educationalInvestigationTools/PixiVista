import { RenderLayerDomainApi } from "@/lib/signal-visualizer/core/rendering/layerApi";
import type { GridLayer } from "@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/gridLayer";
import type { EventMediator } from "@/lib/signal-visualizer/utils/eventMediator";

export class GridLayerApi extends RenderLayerDomainApi<GridLayer> {
    constructor(gridLayer : GridLayer, eventMediator : EventMediator) {
        super(gridLayer, eventMediator)
    }
    registerEvents(): void {

    }

}
