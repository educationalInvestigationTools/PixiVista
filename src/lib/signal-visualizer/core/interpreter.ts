import { SignalSourceManager } from '@/lib/signal-visualizer/application/types/signalSource.ts'

import type {
    OneDimNormalizedSignal,
} from '@/lib/signal-visualizer/core/types.ts'
import { RenderManager } from '@/lib/signal-visualizer/core/renderManager.ts'
import { DataManagerWorker } from './dataManager/dataManagerWorker'
import { areEqualViewPort, type ViewPort } from '../application/types/viewPort'
import { sameSet } from '../utils/utils'

type RenderModel = {
    viewPort: ViewPort
    visibleChannels: string[]
    expectedWidth: number
}

function areEqual(a: RenderModel, b: RenderModel) {
    return sameSet<string>(a.visibleChannels, b.visibleChannels) && areEqualViewPort(a.viewPort, b.viewPort) && a.expectedWidth === b.expectedWidth
}

export class Interpreter {
    private renderer: RenderManager
    private dataManager: DataManagerWorker
    private labels: string[]
    private viewPort: ViewPort
    private lastRenderedData: RenderModel | null = null
    private readonly debouncedRefreshRate = 1000 / 30

    constructor(renderer: RenderManager, viewPort: ViewPort, signalsSourceManager: SignalSourceManager, workerCallback: () => Worker) {
        this.viewPort = viewPort
        this.renderer = renderer
        this.labels = signalsSourceManager.allSignalsBuildData.map(x => x.label)
        this.dataManager = new DataManagerWorker(workerCallback, signalsSourceManager)
    }
    async init() {
        await this.renderer.init(this.labels, this.viewPort)
        setInterval(async () => {
            let flag = true
            const nextRenderData = {
                viewPort: this.viewPort,
                visibleChannels: this.renderer.visibleChannels,
                expectedWidth: Math.floor(this.renderer.sizeData.width * this.renderer.devicePixelRatio)
            }
            if (this.lastRenderedData !== null) {
                if (areEqual(this.lastRenderedData, nextRenderData)) {
                    flag = false
                }
            }
            if (flag) {
                this.lastRenderedData = nextRenderData
                await this.updateChannelsState()
            }
        }, this.debouncedRefreshRate)
    }

    async destroy(): Promise<void> {
        this.renderer.destroy()
    }


    async updateChannelsState(): Promise<void> {
        if (this.lastRenderedData !== null) {
            const viewPort = this.lastRenderedData.viewPort
            const activeChannels = this.lastRenderedData.visibleChannels
            const expectedWidth = this.lastRenderedData.expectedWidth
            const updatedData: OneDimNormalizedSignal[] = await this.dataManager.fetchData(activeChannels, viewPort, expectedWidth)
            await this.renderer.updateSignalData(updatedData, viewPort)
        }
    }

    async changeViewPort(viewPort: ViewPort): Promise<void> {
        this.viewPort = viewPort
    }

    async resize(width: number, height: number) {
        await this.renderer.setSizes({
            width: width,
            height: height,
        })
    }

    async changeChannelVisibility(channelLabel: string, visibility: boolean) {
        if (!visibility) {
            this.renderer.removeChannel(channelLabel)
        } else {
            this.renderer.addChannel(channelLabel)
        }
    }
}
