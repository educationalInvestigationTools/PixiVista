import { type OneDimSignal, OneDimSignals } from '@/lib/signal-visualizer/core/Renderer.ts'
import {
    type CompatibleSignal,
    ViewPort,
} from '@/lib/signal-visualizer/application/SignalSource.ts'
import { PixiRenderer } from '@/lib/signal-visualizer/infrastructure/rendering/pixi-renderer.ts'
import { Envelope } from '@/lib/signal-visualizer/utils/utils.ts'
import type { AxisSignal } from '@/lib/signal-visualizer/core/axis-signal.ts'

export class Interpreter {
    private renderer: PixiRenderer
    private htmlElement: HTMLElement
    private readonly signalsSource: CompatibleSignal[]
    private viewPort: ViewPort

    constructor(container: HTMLElement, viewPort: ViewPort, signalsSource: CompatibleSignal[]) {
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

    async changeChannelVisibility(channelLabel: string, visibility: boolean) {}
}
