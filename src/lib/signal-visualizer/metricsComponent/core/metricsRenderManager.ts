import { PixiRenderer } from '@/lib/signal-visualizer/core/rendering/pixiRenderer.ts'
import type { EventMediator } from '@/lib/signal-visualizer/utils/eventMediator.ts'
import {
    ResizeCommandEventLabel,
    type ResizeCommand,
} from '@/lib/signal-visualizer/application/commands/resizeCommand.ts'
import {
    DestroyCommandEventLabel,
    type DestroyCommand,
} from '@/lib/signal-visualizer/application/commands/destroyCommand.ts'
import type { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'

export class MetricsRenderManager {
    private readonly pixiRenderer: PixiRenderer

    constructor(htmlElement: HTMLElement, private readonly eventMediator: EventMediator) {
        const canvas = document.createElement('canvas')
        canvas.style.height = '100%'
        canvas.style.width = '100%'
        htmlElement.appendChild(canvas)
        this.pixiRenderer = new PixiRenderer(canvas)

        this.eventMediator.addHandler<ResizeCommand>(ResizeCommandEventLabel, async (command) =>
            this.pixiRenderer.resize(command.sizeData),
        )

        this.eventMediator.addHandler<DestroyCommand>(DestroyCommandEventLabel, async () =>
            this.pixiRenderer.destroy(),
        )
    }

    async init(componentRenderLayer: RenderLayer<LayoutDesign>) {
        await this.pixiRenderer.init()
        this.pixiRenderer.app.stage.addChild(componentRenderLayer.container)
        this.pixiRenderer.app.ticker.add(() => {
            this.pixiRenderer.app.renderer.resolution = window.devicePixelRatio
        })
        this.pixiRenderer.app.ticker.add(() => {
            componentRenderLayer.Draw()
        })
    }

    get sizeData() {
        return this.pixiRenderer.sizeData()
    }
}
