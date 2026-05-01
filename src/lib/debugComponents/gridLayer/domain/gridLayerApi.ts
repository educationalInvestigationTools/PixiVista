import { RenderLayerDomainApi } from "@/core/rendering/layerApi";
import type { GridLayer } from "@/infrastructure/rendering/gridLayer/gridLayer";
import type { EventMediator } from "@/utils/eventMediator";


export class GridLayerApi extends RenderLayerDomainApi<GridLayer> {
    constructor(gridLayer: GridLayer, eventMediator: EventMediator) {
        super(gridLayer, eventMediator)
    }
    registerEvents(): void {}
}
