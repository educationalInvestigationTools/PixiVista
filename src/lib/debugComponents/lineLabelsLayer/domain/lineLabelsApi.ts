import { RenderLayerDomainApi } from "@/core/rendering/layerApi";
import type { LineLabelsLayer } from "@/infrastructure/rendering/lineLabelsLayer/lineLabelsLayer";
import type { EventMediator } from "@/utils/eventMediator";


export class LineLabelsApi extends RenderLayerDomainApi<LineLabelsLayer> {
    constructor(lineLabelsLayer: LineLabelsLayer, eventMediator: EventMediator) {
        super(lineLabelsLayer, eventMediator)
    }
    registerEvents(): void {}
}
