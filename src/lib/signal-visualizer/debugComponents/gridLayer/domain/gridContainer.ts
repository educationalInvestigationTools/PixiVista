import { RenderManager } from "@/lib/signal-visualizer/core/rendering/renderManager";
import { GridLayer } from "@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/gridLayer";
import { EventMediator } from "@/lib/signal-visualizer/utils/eventMediator";
import { GridLayerApi } from "./gridLayerApi";
import { GridLayout } from "@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/gridLayout";
import type { GridLabelsMinMaxValues } from "@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/types/types";

export class GridContainer {
    readonly eventMediator: EventMediator = new EventMediator()
    async init(htmlElement: HTMLElement) {
        const renderManager = new RenderManager(htmlElement, this.eventMediator)

        const gridLayout = new GridLayout(
            { width: 0, height: 0 },
            { x: 0, y: 0 },
            { verticalDivisions: 10, horizontalDivisions: 10 }
        )

        const minMaxValues: GridLabelsMinMaxValues = {
            vertical: { min: 0, max: 10 },
            horizontal: { min: 0, max: 10 }
        }

        const gridLabelsConfig = {
            vertical: {
                include: true,
                side: 'left',
                formatter: (value : number) => value.toFixed(2)
            },
            horizontal: {
                include: true,
                side: 'down',
                formatter: (value : number) => value.toFixed(2)
            }
        } as const

        const component = new GridLayer(gridLayout, minMaxValues, gridLabelsConfig)
        const componentApi = new GridLayerApi(component, this.eventMediator)

        await renderManager.init(componentApi.Component)
    }
}
