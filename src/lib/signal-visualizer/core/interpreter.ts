import { type SignalSource, type SignalSourceBuildData } from '@/lib/signal-visualizer/application/types/signalSource.ts'

import type {
    NormalizedSignal,
    OneDimNormalizedSignal,
} from '@/lib/signal-visualizer/core/types.ts'
import { RenderManager } from '@/lib/signal-visualizer/core/renderManager.ts'
import { Envelope } from '@/lib/signal-visualizer/utils/envelope.ts'
import { largestTriangleThreeBuckets } from '../utils/lttb'
import { ViewPort } from '@/lib/signal-visualizer/application/types/viewPort.ts'
import { MockSignalSourceBuilder, type MockSignalSourceConstructor } from '../infrastructure/signals/mockSignalSource'

export class Interpreter {
    private renderer: RenderManager
    private readonly signalsSources: Record<string, SignalSource>
    private viewPort: ViewPort

    constructor(renderer: RenderManager, viewPort: ViewPort, signalsSourceBuildData: SignalSourceBuildData[]) {
        this.viewPort = viewPort
        /*
        This code is not solid, does not follow ocp.
        */
        this.signalsSources = signalsSourceBuildData.reduce<Record<string, SignalSource>>((acc, buildData) => {
            if (buildData.signalSourceType === 'MockSignalSource') {
                const builder = new MockSignalSourceBuilder()
                acc[buildData.label] = builder.build(buildData as MockSignalSourceConstructor)
            }
            return acc
        }, {})
        this.renderer = renderer
    }

    async init() {
        const data: OneDimNormalizedSignal[] = []
        for (const label in this.signalsSources) {
            data.push(await this.fetchData(label))
        }
        await this.renderer.init(data, this.viewPort)
    }

    async destroy(): Promise<void> {
        this.renderer.destroy()
    }

    private async fetchData(label: string): Promise<OneDimNormalizedSignal> {
        const sizeData = this.renderer.getChannelSizeData()
        const viewPort = this.viewPort
        const signalSource = this.signalsSources[label]!
        const data = await signalSource.read(viewPort)
        const expectedWidth = Math.floor(sizeData.width * this.renderer.devicePixelRatio)
        const dataToUse = largestTriangleThreeBuckets(data, expectedWidth)
        const xEnvelope = new Envelope(dataToUse.xValues, {
            min: this.viewPort.startSeconds,
            max: this.viewPort.startSeconds + this.viewPort.lengthSeconds,
        })
        const xAxisSignal: NormalizedSignal = {
            values: xEnvelope.normalized,
            minMaxValues: {
                min: xEnvelope.min,
                max: xEnvelope.max,
            },
        }
        const yEnvelope = new Envelope(dataToUse.yValues)
        const yAxisSignal: NormalizedSignal = {
            values: yEnvelope.normalized,
            minMaxValues: {
                min: yEnvelope.min,
                max: yEnvelope.max,
            },
        }
        return Promise.resolve({
            label: signalSource.label,
            xSignal: xAxisSignal,
            ySignal: yAxisSignal,
        })
    }

    async updateChannelsState(): Promise<void> {
        const viewPort = this.viewPort
        const activeChannels = this.renderer.visibleChannels
        const updatedData: OneDimNormalizedSignal[] = []
        for (const label of activeChannels) {
            updatedData.push(await this.fetchData(label))
        }
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
            const signal = await this.fetchData(channelLabel)
            this.renderer.addChannel(signal)
        }
    }
}
