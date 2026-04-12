import { type SignalSourceBuildData } from '@/lib/signal-visualizer/application/types/signalSource.ts'

import type {
    OneDimNormalizedSignal,
} from '@/lib/signal-visualizer/core/types.ts'
import { RenderManager } from '@/lib/signal-visualizer/core/renderManager.ts'
import { DataManager } from './dataManager/dataManager'
import { DataManagerWorker } from './dataManager/dataManagerWorker'
import { areEqualViewPort, type ViewPort } from '../application/types/viewPort'
import { sameSet } from '../utils/utils'

type RenderedData = {
    viewPort: ViewPort
    visibleChannels: string[]
}

function areEqual(a: RenderedData, b: RenderedData) {
    return sameSet<string>(a.visibleChannels, b.visibleChannels) && areEqualViewPort(a.viewPort, b.viewPort)
}

export class Interpreter {
    private renderer: RenderManager
    private dataManager: DataManager
    private labels: string[]
    private viewPort: ViewPort
    private lastRenderedData: RenderedData | null = null
    private readonly debouncedRefreshRate = 1000 / 30

    constructor(renderer: RenderManager, viewPort: ViewPort, signalsSourceBuildData: SignalSourceBuildData[]) {
        this.viewPort = viewPort
        this.renderer = renderer
        this.labels = signalsSourceBuildData.map(x => x.label)
        this.dataManager = new DataManagerWorker(signalsSourceBuildData)
    }

    private get expectedWidth(): number {
        return Math.floor(this.renderer.sizeData.width * this.renderer.devicePixelRatio)
    }

    private fetchData(labels: string[]) {
        return this.dataManager.fetchData(labels, this.viewPort, this.expectedWidth)
    }

    async init() {
        await this.renderer.init(this.labels, this.viewPort)
        setInterval(async () => {
            let flag = true
            const visibleChannels = this.renderer.visibleChannels
            const viewPort = this.viewPort
            if (this.lastRenderedData !== null) {
                if (areEqual(this.lastRenderedData, {
                    viewPort,
                    visibleChannels
                })) {
                    flag = false
                }
            }
            if (flag) {
                this.lastRenderedData = {
                    viewPort: viewPort,
                    visibleChannels
                }
                await this.updateChannelsState()
            }
        }, this.debouncedRefreshRate)
    }

    async destroy(): Promise<void> {
        this.renderer.destroy()
    }


    async updateChannelsState(): Promise<void> {
        const viewPort = this.lastRenderedData?.viewPort
        const activeChannels = this.lastRenderedData?.visibleChannels
        const updatedData: OneDimNormalizedSignal[] = await this.fetchData(activeChannels!)
        await this.renderer.updateSignalData(updatedData, viewPort!)
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
