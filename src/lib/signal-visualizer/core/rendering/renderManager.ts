import { PixiRenderer } from '@/lib/signal-visualizer/core/rendering/pixiRenderer.ts'
import type { EventMediator } from '@/lib/signal-visualizer/utils/eventMediator.ts'
import { GetPerformanceMetrics } from '../../application/querys/getPerformanceMetrics'
import {
    ResizeCommandEventLabel,
    type ResizeCommand,
} from '../../application/commands/resizeCommand'
import {
    DestroyCommandEventLabel,
    type DestroyCommand,
} from '../../application/commands/destroyCommand'
import type { LayoutDesign } from './layoutDesign'
import type { RenderLayer } from './renderLayer'
import type { PerformanceMetrics } from '@/lib/signal-visualizer/core/types/performanceMetrics.ts'

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
            this.pixiRenderer.app.renderer.resolution = window.devicePixelRatio
        })
        this.pixiRenderer.app.ticker.add(() => {
            const sizeData = this.sizeData
            const timeStart = performance.now()
            componentLayer.Draw()
            const timeEnd = performance.now()
            const windowDevicePixelRatio = this.pixiRenderer.app.renderer.resolution
            const performanceMetrics: PerformanceMetrics = {
                renderTime: timeEnd - timeStart,
                sizeData: {
                    width: sizeData.width,
                    height: sizeData.height,
                },
                windowDevicePixelRatio: Math.round(windowDevicePixelRatio * 100) / 100,
                refreshRate: this.pixiRenderer.app.ticker.FPS,
                date : new Date()
            }
            this.eventMediator.publish(new GetPerformanceMetrics(performanceMetrics))
        })
    }

    get sizeData() {
        return this.pixiRenderer.sizeData()
    }

    get expectedWidth() {
        const devicePixelRatio = window.devicePixelRatio
        return Math.floor(this.sizeData.width * devicePixelRatio)
    }
}
