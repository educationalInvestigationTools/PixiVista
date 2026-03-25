import { OneDimSignals } from '@/lib/signal-visualizer/core/renderer.ts'
import { type SignalSource, ViewPort } from '@/lib/signal-visualizer/application/signalSource.ts'
import { PixiRenderer } from '@/lib/signal-visualizer/infrastructure/rendering/core/pixiRenderer.ts'
import { Envelope } from '@/lib/signal-visualizer/utils/utils.ts'

import type { AxisSignal, OneDimSignal } from '@/lib/signal-visualizer/core/types.ts'

export class Interpreter {
    private renderer: PixiRenderer
    private htmlElement: HTMLElement
    private readonly signalsSource: SignalSource[]
    private viewPort: ViewPort

    constructor(container: HTMLElement, viewPort: ViewPort, signalsSource: SignalSource[]) {
        this.viewPort = viewPort
        this.signalsSource = signalsSource
        this.renderer = new PixiRenderer()
        this.htmlElement = container
        this.htmlElement.appendChild(this.renderer.canvas)
    }

    async init() {
        const data = await this.fetchData()
        await this.renderer.init(data)
    }

    async destroy(): Promise<void> {
        this.renderer.destroy()
    }

    private async fetchData(): Promise<OneDimSignals> {
        const viewPort = this.viewPort
        const signals = []
        for (let i = 0; i < this.signalsSource.length; i++) {
            const signalSource = this.signalsSource[i]!
            const data = signalSource.read(viewPort)
            const xEnvelope = new Envelope(data.xValues)
            const xAxisSignal: AxisSignal = {
                valuesNormalized: xEnvelope.normalized,
                minMaxValues: {
                    min: xEnvelope.min,
                    max: xEnvelope.max,
                },
            }

            const yEnvelope = new Envelope(data.yValues)
            const yAxisSignal: AxisSignal = {
                valuesNormalized: yEnvelope.normalized,
                minMaxValues: {
                    min: yEnvelope.min,
                    max: yEnvelope.max,
                },
            }
            const oneDimensionalSignalData: OneDimSignal = {
                label: signalSource.label,
                xSignal: xAxisSignal,
                ySignal: yAxisSignal,
            }
            signals.push(oneDimensionalSignalData)
        }
        const oneDimSignal = new OneDimSignals(viewPort, signals)
        return Promise.resolve(oneDimSignal)
    }

    async changeViewPort(viewPort: ViewPort): Promise<void> {
        this.viewPort = viewPort
        const updatedData = await this.fetchData()
        await this.renderer.updateSignalData(updatedData)
    }

    async updateViewport(startSeconds: number) {
        this.viewPort.updateStartSeconds(startSeconds)
        const updatedData = await this.fetchData()
        await this.renderer.updateSignalData(updatedData)
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
            const data = await this.fetchData()
            const signal = data.channels[0]!
            this.renderer.addChannel(channelLabel, signal)
        }
    }
}
