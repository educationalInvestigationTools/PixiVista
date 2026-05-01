import { GridLayerApi } from '@/debugComponents/gridLayer/domain/gridLayerApi'
import { generateRandomString } from '@/debugComponents/labelsLayer/utils/utils'
import { EventMediator } from '@/utils/eventMediator'
import { RenderManager } from '@/core/rendering/renderManager'
import { GridLayer } from '@/infrastructure/rendering/gridLayer/gridLayer'

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
