import { EventMediator } from '@/lib/signal-visualizer/utils/eventMediator.ts'
import { RenderManager } from '@/lib/signal-visualizer/core/rendering/renderManager.ts'
import { LabelsGridApi } from './labelsGridApi'
import { LabelsGrid, type GridDescription } from './labelsGrid'


export class LabelsContainer {
    readonly eventMediator: EventMediator = new EventMediator()
    async init(htmlElement: HTMLElement) {
        const renderManager = new RenderManager(htmlElement, this.eventMediator)
        const gridDescription : GridDescription = {
            columnsPerRow : [6, 4, 10]
        }
        const component = new LabelsGrid(gridDescription)

        const componentApi = new LabelsGridApi(component, this.eventMediator)
        await renderManager.init(componentApi.Component)
    }
}
