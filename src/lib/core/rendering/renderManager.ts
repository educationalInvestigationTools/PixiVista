
import { GetPerformanceMetrics } from '@/application/querys/getPerformanceMetrics'
import {
    ResizeCommandEventLabel,
    type ResizeCommand,
} from '@/application/commands/resizeCommand'
import {
    DestroyCommandEventLabel,
    type DestroyCommand,
} from '@/application/commands/destroyCommand'
import type { LayoutDesign } from '@/core/rendering/layoutDesign'
import type { RenderLayer } from '@/core/rendering/renderLayer'
import { PixiRenderer } from '@/core/rendering/pixiRenderer'
import type { PerformanceMetrics } from '@/core/types/performanceMetrics'
import type { EventMediator } from '@/utils/eventMediator'

export class RenderManager {
    private pixiRenderer: PixiRenderer
    private eventMediator: EventMediator

    constructor(htmlElement: HTMLElement, eventMediator: EventMediator) {
        const canvas = document.createElement('canvas')
        canvas.style.height = '100%'
        canvas.style.width = '100%'
        htmlElement.appendChild(canvas)
        this.pixiRenderer = new PixiRenderer(canvas)
        this.eventMediator = eventMediator
        this.eventMediator.addHandler<ResizeCommand>(
            ResizeCommandEventLabel,
            async (command) => await this.pixiRenderer.resize(command.sizeData),
        )
        this.eventMediator.addHandler<DestroyCommand>(DestroyCommandEventLabel, async () =>
            this.pixiRenderer.destroy(),
        )
    }
    async init(componentRenderLayer: RenderLayer<LayoutDesign>) {
        await this.pixiRenderer.init()
        const componentLayer = componentRenderLayer
        this.pixiRenderer.app.stage.addChild(componentLayer.container)
        this.pixiRenderer.app.ticker.add(() => {
            const sizeData = this.sizeData
            const timeStart = performance.now()
            componentLayer.Draw()
            const timeEnd = performance.now()
            const windowDevicePixelRatio = this.pixiRenderer.resolution
            const performanceMetrics: PerformanceMetrics = {
                renderTimeMs: timeEnd - timeStart,
                sizeData: {
                    width: sizeData.width,
                    height: sizeData.height,
                },
                resolution: windowDevicePixelRatio,
                refreshRateFps: this.pixiRenderer.app.ticker.FPS,
                observedAt: new Date()
            }
            this.eventMediator.publish(new GetPerformanceMetrics(performanceMetrics))
        })
    }

    get sizeData() {
        return this.pixiRenderer.sizeData()
    }

    get expectedWidth() {
        const devicePixelRatio = this.pixiRenderer.resolution
        return Math.floor(this.sizeData.width * devicePixelRatio)
    }
}
