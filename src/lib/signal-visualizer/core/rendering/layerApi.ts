import { DestroyCommand, DestroyCommandEventLabel } from '../../application/commands/destroyCommand'
import { ResizeCommandEventLabel, type ResizeCommand } from '../../application/commands/resizeCommand'
import type { EventMediator } from '../../utils/eventMediator'
import type { LayoutDesign } from './layoutDesign'
import type { RenderLayer } from './renderLayer'

export abstract class RenderLayerDomainApi<T extends RenderLayer<LayoutDesign>> {
    protected readonly component: T
    protected readonly eventMediator: EventMediator
    protected constructor(component: T, eventMediator: EventMediator) {
        this.component = component
        this.eventMediator = eventMediator

        this.eventMediator.addHandler<ResizeCommand>(ResizeCommandEventLabel, async (command) =>
            this.component.updateSize(command.sizeData),
        )
        this.eventMediator.addHandler<DestroyCommand>(DestroyCommandEventLabel, async (_command) => {
            this.component.destroy()
        })
        this.registerEvents()
    }
    abstract registerEvents(): void

    get Component() {
        return this.component
    }
}
