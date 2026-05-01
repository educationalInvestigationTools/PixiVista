import { RenderManager } from "@/core/rendering/renderManager"
import { LabelsGridApi } from "@/debugComponents/labelsLayer/domain/labelsGridApi"
import type { GridDescription } from "@/debugComponents/labelsLayer/domain/types/gridDescription"
import { LabelsGridLayer } from "@/debugComponents/labelsLayer/infrastructure/rendering/labelsGridLayer"
import { EventMediator } from "@/utils/eventMediator"

export class LabelsContainer {
    readonly eventMediator: EventMediator = new EventMediator()
    async init(htmlElement: HTMLElement) {
        const renderManager = new RenderManager(htmlElement, this.eventMediator)
        const gridDescription: GridDescription = {
            columnsPerRow: [6, 4, 10, 10, 2, 3, 5, 10, 7, 8, 5, 4, 1, 2],
        }
        const component = new LabelsGridLayer(gridDescription)

        const componentApi = new LabelsGridApi(component, this.eventMediator)
        await renderManager.init(componentApi.Component)
    }
}
