import type { EventMediator } from "../../utils/eventMediator";
import type { LayoutDesign } from "./layoutDesign";
import type { RenderLayer } from "./renderLayer";

export abstract class RenderLayerDomainApi<T extends RenderLayer<LayoutDesign>> {
    protected readonly component: T
    protected readonly eventMediator : EventMediator
    constructor(component: T, eventMediator: EventMediator) {
        this.component = component
        this.eventMediator = eventMediator
        this.registerEvents()
    }
    abstract registerEvents(): void

    get Component() {
        return this.component
    }
}
