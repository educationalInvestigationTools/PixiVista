import {
    ComponentLayer
} from '@/lib/signal-visualizer/infrastructure/rendering/componentLayer/componentLayer.ts'
import type {OneDimSignal, SizeData} from '@/lib/signal-visualizer/core/types.ts'
import type {ViewPort} from '@/lib/signal-visualizer/application/signalSource.ts'
import {
    ComponentLayout
} from '@/lib/signal-visualizer/infrastructure/rendering/componentLayer/layout.ts'
import {PixiRenderer} from '@/lib/signal-visualizer/core/rendering/pixiRenderer.ts'
import type {PerformanceMetrics} from '@/lib/signal-visualizer/application/types.ts'
import type {EventMediator} from '@/lib/signal-visualizer/utils/eventMediator.ts'

export class RenderManager {
    private pixiRenderer: PixiRenderer
    private componentLayer?: ComponentLayer
    private eventMediator: EventMediator<PerformanceMetrics>

    constructor(eventMediator: EventMediator<PerformanceMetrics>) {
        this.pixiRenderer = new PixiRenderer()
        this.eventMediator = eventMediator
    }

    async init(signals: OneDimSignal[], viewPort: ViewPort) {
        await this.pixiRenderer.init()
        const sizeData = {
            width: this.pixiRenderer.canvas.clientWidth,
            height: this.pixiRenderer.canvas.clientHeight,
        }
        const gridData = {
            verticalDivisions: 10,
            horizontalDivisions: 5,
        }

        this.componentLayer = new ComponentLayer(
            new ComponentLayout(sizeData, {
                x: 0,
                y: 0,
            }),
            {
                min: viewPort.startSeconds,
                max: viewPort.startSeconds + viewPort.lengthSeconds,
            },
            gridData.verticalDivisions,
        )
        for (const signal of signals) {
            this.componentLayer.channelsLayer.addChannel(signal)
        }
        this.pixiRenderer.app.stage.addChild(this.componentLayer.container)
        this.pixiRenderer.app.ticker.add(() => {
            const timeStart = performance.now()
            this.componentLayer?.Draw()
            const timeEnd = performance.now()
            const windowDevicePixelRatio = window.devicePixelRatio
            const performanceMetrics: PerformanceMetrics = {
                renderTime: timeEnd - timeStart,
                sizeData: {
                    width: windowDevicePixelRatio * this.pixiRenderer.canvas.clientWidth,
                    height: windowDevicePixelRatio * this.pixiRenderer.canvas.clientHeight
                },
                refreshRate :  this.pixiRenderer.app.ticker.FPS
            }
            this.eventMediator.callback(performanceMetrics)
        })
    }

    async setSizes(sizeData: SizeData) {
        this.pixiRenderer.app.renderer.resize(
            sizeData.width,
            sizeData.height,
            window.devicePixelRatio,
        )
        this.componentLayer?.updateSize(sizeData)
    }

    addChannel(oneDimSignal: OneDimSignal) {
        this.componentLayer?.channelsLayer.addChannel(oneDimSignal)
    }

    removeChannel(label: string) {
        this.componentLayer?.channelsLayer.removeChannel(label)
    }

    get visibleChannels(): string[] {
        return this.componentLayer?.channelsLayer.activeChannels!
    }

    async updateSignalData(signals: OneDimSignal[], viewPort: ViewPort) {
        for (const signal of signals) {
            const channelLayer = this.componentLayer?.channelsLayer.getByLabel(signal.label)
            if (channelLayer != undefined) {
                channelLayer.updateData(signal)
            }
        }
        this.componentLayer?.axisLayer.updateMinMaxValues({
            min: viewPort.startSeconds,
            max: viewPort.startSeconds + viewPort.lengthSeconds,
        })
    }

    get canvas(): HTMLCanvasElement {
        return this.pixiRenderer.canvas
    }

    destroy(): void {
        this.pixiRenderer.destroy()
    }
}
