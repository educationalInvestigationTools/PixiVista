import { type SignalSourceBuildData } from '@/lib/signal-visualizer/application/types/signalSource.ts'

import type {
    OneDimNormalizedSignal,
} from '@/lib/signal-visualizer/core/types.ts'
import { RenderManager } from '@/lib/signal-visualizer/core/renderManager.ts'
import { ViewPort } from '@/lib/signal-visualizer/application/types/viewPort.ts'
import { DataManager } from './dataManager/dataManager'
import { DataManagerWorker } from './dataManager/dataManagerWorker'

export class Interpreter {
    private renderer: RenderManager
    private dataManager: DataManager
    private labels: string[]
    private viewPort: ViewPort

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
        const data = await this.fetchData(this.labels)
        await this.renderer.init(data, this.viewPort)
    }

    async destroy(): Promise<void> {
        this.renderer.destroy()
    }


    async updateChannelsState(): Promise<void> {
        const viewPort = this.viewPort
        const activeChannels = this.renderer.visibleChannels
        const updatedData: OneDimNormalizedSignal[] = await this.fetchData(activeChannels)
        await this.renderer.updateSignalData(updatedData, viewPort)
    }

    async changeViewPort(viewPort: ViewPort): Promise<void> {
        if (viewPort.lengthSeconds === this.viewPort.lengthSeconds) {
            this.viewPort.updateStartSeconds(viewPort.startSeconds)
        } else {
            this.viewPort = viewPort
        }
        await this.updateChannelsState()
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
            const signals = (await this.fetchData([channelLabel]))
            this.renderer.addChannel(signals[0]!)
        }
    }
}
