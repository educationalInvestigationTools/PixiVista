import {
    ComponentLayer
} from '@/lib/signal-visualizer/infrastructure/rendering/componentLayer/componentLayer.ts'
import type {OneDimNormalizedSignal, SizeData} from '@/lib/signal-visualizer/core/types.ts'
import {
    ComponentLayout
} from '@/lib/signal-visualizer/infrastructure/rendering/componentLayer/layout.ts'
import {PixiRenderer} from '@/lib/signal-visualizer/core/rendering/pixiRenderer.ts'
import type {
    PerformanceMetrics
} from '@/lib/signal-visualizer/application/types/performanceMetrics.ts'
import type {EventMediator} from '@/lib/signal-visualizer/utils/eventMediator.ts'
import {ViewPort} from '@/lib/signal-visualizer/application/types/viewPort.ts'

export class RenderManager {
    private pixiRenderer: PixiRenderer
    private componentLayer?: ComponentLayer
    private eventMediator: EventMediator<PerformanceMetrics>

    constructor(canvas: HTMLCanvasElement, eventMediator: EventMediator<PerformanceMetrics>) {
        this.pixiRenderer = new PixiRenderer(canvas)
        this.eventMediator = eventMediator
    }

    async init(signals: OneDimNormalizedSignal[], viewPort: ViewPort) {
        await this.pixiRenderer.init()
        const sizeData = this.pixiRenderer.sizeData()
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
            this.pixiRenderer.app.renderer.resolution = window.devicePixelRatio
        })
        this.pixiRenderer.app.ticker.add(() => {
            const sizeData = this.pixiRenderer.sizeData()
            const timeStart = performance.now()
            this.componentLayer?.Draw()
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
            }
            this.eventMediator.callback(performanceMetrics)
        })
    }

    async setSizes(sizeData: SizeData) {
        await this.pixiRenderer.resize(sizeData)
        this.componentLayer?.updateSize(sizeData)
    }

    addChannel(oneDimSignal: OneDimNormalizedSignal) {
        this.componentLayer?.channelsLayer.addChannel(oneDimSignal)
    }

    removeChannel(label: string) {
        this.componentLayer?.channelsLayer.removeChannel(label)
    }

    get visibleChannels(): string[] {
        return this.componentLayer?.channelsLayer.activeChannels!
    }

    get sizeData(): SizeData {
        return this.pixiRenderer.sizeData()
    }

    get devicePixelRatio(): number {
        return window.devicePixelRatio
    }

    getChannelSizeData(): SizeData {
        return this.componentLayer?.channelsLayer.layoutDesign.buildChannelSize() ?? this.sizeData
    }

    async updateSignalData(signals: OneDimNormalizedSignal[], viewPort: ViewPort) {
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

    destroy(): void {
        this.pixiRenderer.destroy()
    }
}
