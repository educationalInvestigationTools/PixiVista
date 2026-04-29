import { RenderManager } from "@/lib/signal-visualizer/core/rendering/renderManager";
import { GridLayer} from "@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/gridLayer";
import { EventMediator } from "@/lib/signal-visualizer/utils/eventMediator";
import { GridLayerApi } from "./gridLayerApi";
import { generateRandomString } from "../../labelsLayer/utils/utils";

export class GridContainer {
    readonly eventMediator: EventMediator = new EventMediator()
    async init(htmlElement: HTMLElement) {
        const renderManager = new RenderManager(htmlElement, this.eventMediator)
        const component = new GridLayer()
        component.addLabelSide('left', (_arg0: number) => generateRandomString(2, 5))
        component.addLabelSide('down', (_arg0: number) => generateRandomString(2, 5))
        component.addLabelSide('up', (_arg0: number) => generateRandomString(2, 5))
        const componentApi = new GridLayerApi(component, this.eventMediator)

        await renderManager.init(componentApi.Component)
    }
}
