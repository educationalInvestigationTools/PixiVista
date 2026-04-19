import { ComponentLayer } from '@/lib/signal-visualizer/infrastructure/rendering/componentLayer/componentLayer.ts'
import type { OneDimNormalizedSignal, SizeData } from '@/lib/signal-visualizer/core/types.ts'
import { ComponentLayout } from '@/lib/signal-visualizer/infrastructure/rendering/componentLayer/layout.ts'
import { PixiRenderer } from '@/lib/signal-visualizer/core/rendering/pixiRenderer.ts'
import type { PerformanceMetrics } from '@/lib/signal-visualizer/application/types/performanceMetrics.ts'
import type { EventMediator } from '@/lib/signal-visualizer/utils/eventMediator.ts'
import { areEqualViewPort, type ViewPort } from '../application/types/viewPort'
import { GetPerformanceMetrics } from '../application/querys/getPerformanceMetrics'
import { sameSet } from '../utils/utils'
import type { ChangeViewPortCommand } from '../application/commands/changeViewPortCommand'
import type { ResizeCommand } from '../application/commands/resizeCommand'
import type { ChangeChannelVisibilityCommand } from '../application/commands/changeChannelVisibilityCommand'

export type ReactiveRenderModel = {
    viewPort: ViewPort
    visibleChannels: string[]
    expectedWidth: number
}

export function areEqual(a: ReactiveRenderModel, b: ReactiveRenderModel) {
    return (
        sameSet<string>(a.visibleChannels, b.visibleChannels) &&
        areEqualViewPort(a.viewPort, b.viewPort) &&
        a.expectedWidth === b.expectedWidth
    )
}

export function clone(a: ReactiveRenderModel): ReactiveRenderModel {
    return {
        viewPort: {
            startSeconds: a.viewPort.startSeconds,
            lengthSeconds: a.viewPort.lengthSeconds,
        },
        visibleChannels: a.visibleChannels,
        expectedWidth: a.expectedWidth,
    }
}

export class RenderManager {
    private pixiRenderer: PixiRenderer
    private componentLayer?: ComponentLayer
    private eventMediator: EventMediator
    private viewPort?: ViewPort

    constructor(canvas: HTMLCanvasElement, eventMediator: EventMediator) {
        this.pixiRenderer = new PixiRenderer(canvas)
        this.eventMediator = eventMediator
    }

    async init(labels: string[], viewPort: ViewPort) {
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
        for (const label of labels) {
            this.componentLayer.channelsLayer.addChannel(label)
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
            this.eventMediator.publish(new GetPerformanceMetrics(performanceMetrics))
        })
        this.viewPort = viewPort
    }

    get CurrentRenderModel(): ReactiveRenderModel {
        return {
            viewPort: this.viewPort!,
            visibleChannels: this.visibleChannels,
            expectedWidth: Math.floor(this.sizeData.width * this.devicePixelRatio),
        }
    }

    async setSizes(sizeData: SizeData) {
        await this.pixiRenderer.resize(sizeData)
        this.componentLayer?.updateSize(sizeData)
    }

    addChannel(label: string) {
        this.componentLayer?.channelsLayer.addChannel(label)
    }

    removeChannel(label: string) {
        this.componentLayer?.channelsLayer.removeChannel(label)
    }

    private get visibleChannels(): string[] {
        return this.componentLayer?.channelsLayer.activeChannels!
    }

    private get sizeData(): SizeData {
        return this.pixiRenderer.sizeData()
    }

    private get devicePixelRatio(): number {
        return window.devicePixelRatio
    }

    async render(signals: OneDimNormalizedSignal[]) {
        for (const signal of signals) {
            const channelLayer = this.componentLayer?.channelsLayer.getByLabel(signal.label)
            if (channelLayer !== undefined) {
                channelLayer.updateData(signal)
            }
        }
        this.componentLayer?.axisLayer.updateMinMaxValues({
            min: this.viewPort!.startSeconds,
            max: this.viewPort!.startSeconds + this.viewPort!.lengthSeconds,
        })
    }

    async changeViewPort(command: ChangeViewPortCommand): Promise<void> {
        this.viewPort = command.viewPort
    }

    async resize(command: ResizeCommand) {
        await this.setSizes({
            width: command.width,
            height: command.height,
        })
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
