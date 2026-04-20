import { ComponentLayer } from '@/lib/signal-visualizer/infrastructure/rendering/componentLayer/componentLayer.ts'
import type { OneDimNormalizedSignal } from '@/lib/signal-visualizer/core/types.ts'
import { ComponentLayout } from '@/lib/signal-visualizer/infrastructure/rendering/componentLayer/layout.ts'
import { PixiRenderer } from '@/lib/signal-visualizer/core/rendering/pixiRenderer.ts'
import type { PerformanceMetrics } from '@/lib/signal-visualizer/application/types/performanceMetrics.ts'
import type { EventMediator } from '@/lib/signal-visualizer/utils/eventMediator.ts'
import { GetPerformanceMetrics } from '../application/querys/getPerformanceMetrics'
import type { ChangeViewPortCommand } from '../application/commands/changeViewPortCommand'
import type { ResizeCommand } from '../application/commands/resizeCommand'
import type { ChangeChannelVisibilityCommand } from '../application/commands/changeChannelVisibilityCommand'
import type { ViewPort } from '../application/types/viewPort'
import type { RenderDependencies } from './renderDependencies'

export class RenderManager {
    private pixiRenderer: PixiRenderer
    private componentLayer?: ComponentLayer
    private eventMediator: EventMediator
    private viewPort?: ViewPort

    constructor(htmlElement: HTMLElement, eventMediator: EventMediator) {
        const canvas = document.createElement('canvas')
        canvas.style.height = '100%'
        canvas.style.width = '100%'
        canvas.style.display = 'block'
        htmlElement.appendChild(canvas)
        this.pixiRenderer = new PixiRenderer(canvas)
        this.eventMediator = eventMediator
    }

    async init(labels: string[], viewPort: ViewPort) {
        await this.pixiRenderer.init()
        this.viewPort = viewPort
        const sizeData = this.pixiRenderer.sizeData()
        const gridData = {
            verticalDivisions: 10,
            horizontalDivisions: 5,
        }

        const minMaxValues = {
            min: this.viewPort!.startSeconds,
            max: this.viewPort!.startSeconds + this.viewPort!.lengthSeconds,
        }

        this.componentLayer = new ComponentLayer(
            new ComponentLayout(sizeData, {
                x: 0,
                y: 0,
            }),
            minMaxValues,
            gridData.verticalDivisions,
            labels,
        )
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
            this.eventMediator.publish(new GetPerformanceMetrics(performanceMetrics))
        })
    }

    get CurrentRenderDependencies(): RenderDependencies {
        const sizeData = this.pixiRenderer.sizeData()
        const devicePixelRatio = window.devicePixelRatio
        const visibleChannels = this.componentLayer?.channelsLayer.activeChannels!
        const expectedWidth = Math.floor(sizeData.width * devicePixelRatio)
        return {
            viewPort: this.viewPort!,
            visibleChannels: visibleChannels,
            expectedWidth,
        }
    }

    addChannel(label: string) {
        this.componentLayer?.channelsLayer.addChannel(label)
    }

    removeChannel(label: string) {
        this.componentLayer?.channelsLayer.removeChannel(label)
    }

    async updateSignalData(signals: OneDimNormalizedSignal[]) {
        const minMaxValues = {
            min: this.viewPort!.startSeconds,
            max: this.viewPort!.startSeconds + this.viewPort!.lengthSeconds,
        }
        this.componentLayer!.updateSignalsData(signals, minMaxValues)
    }

    async changeViewPort(command: ChangeViewPortCommand): Promise<void> {
        this.viewPort = command.viewPort
    }

    async resize(command: ResizeCommand) {
        await this.pixiRenderer.resize(command.sizeData)
        this.componentLayer?.updateSize(command.sizeData)
    }

    async changeChannelVisibility(command: ChangeChannelVisibilityCommand) {
        if (!command.visibility) {
            this.removeChannel(command.channelLabel)
        } else {
            this.addChannel(command.channelLabel)
        }
    }

    destroy(): void {
        this.pixiRenderer.destroy()
    }
}
