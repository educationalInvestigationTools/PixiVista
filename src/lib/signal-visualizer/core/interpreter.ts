import { type SignalSource, ViewPort } from '@/lib/signal-visualizer/application/signalSource.ts'

import type { AxisSignal, OneDimSignal } from '@/lib/signal-visualizer/core/types.ts'
import { RenderManager } from '@/lib/signal-visualizer/core/renderManager.ts'
import { Envelope } from '@/lib/signal-visualizer/utils/envelope.ts'
import { largestTriangleThreeBuckets } from '../utils/lttb'

export class Interpreter {
    private renderer: RenderManager
    private readonly signalsSources: Record<string, SignalSource>
    private viewPort: ViewPort

    constructor(
        renderer: RenderManager,
        viewPort: ViewPort,
        signalsSource: SignalSource[],
    ) {
        this.viewPort = viewPort
        this.signalsSources = signalsSource.reduce<Record<string, SignalSource>>((acc, signal) => {
            acc[signal.label] = signal
            return acc
        }, {})
        this.renderer = renderer
    }

    async init() {
        const data: OneDimSignal[] = []
        for (const label in this.signalsSources) {
            data.push(await this.fetchData(label))
        }
        await this.renderer.init(data, this.viewPort)
    }

    async destroy(): Promise<void> {
        this.renderer.destroy()
    }

    private async fetchData(label: string): Promise<OneDimSignal> {
        const viewPort = this.viewPort
        const signalSource = this.signalsSources[label]!
        const data = signalSource.read(viewPort)
        const downSampledData = largestTriangleThreeBuckets(
            data,
            this.renderer.sizeData.width * this.renderer.devicePixelRatio,
        )

        const dataToUse = downSampledData

        const xEnvelope = new Envelope(dataToUse.xValues)
        const xAxisSignal: AxisSignal = {
            valuesNormalized: xEnvelope.normalized,
            minMaxValues: {
                min: xEnvelope.min,
                max: xEnvelope.max,
            },
        }

        const yEnvelope = new Envelope(dataToUse.yValues)
        const yAxisSignal: AxisSignal = {
            valuesNormalized: yEnvelope.normalized,
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
        const updatedData: OneDimSignal[] = []
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
