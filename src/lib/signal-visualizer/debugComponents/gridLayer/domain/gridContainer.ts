import { RenderManager } from "@/lib/signal-visualizer/core/rendering/renderManager";
import { GridLayer, type GridLayoutDescription, type Side } from "@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/gridLayer";
import { EventMediator } from "@/lib/signal-visualizer/utils/eventMediator";
import { GridLayerApi } from "./gridLayerApi";
import { generateRandomString } from "../../labelsLayer/utils/utils";

export class GridContainer {
    readonly eventMediator: EventMediator = new EventMediator()
    async init(htmlElement: HTMLElement) {
        const renderManager = new RenderManager(htmlElement, this.eventMediator)


        const sides : Map <Side, (arg0: number) => string> = new Map()
        sides.set('left', (_arg0: number) => generateRandomString(2, 5))
        sides.set('down', (_arg0: number) => generateRandomString(2, 5))
        sides.set('up', (_arg0: number) => generateRandomString(2, 5))
        const gridLayoutDescription: GridLayoutDescription = {
            sides
        }
        const component = new GridLayer(gridLayoutDescription)
        const componentApi = new GridLayerApi(component, this.eventMediator)

        await renderManager.init(componentApi.Component)
    }
}
