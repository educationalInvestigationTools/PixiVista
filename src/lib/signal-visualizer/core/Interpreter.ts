import {
    OneDimSignals,
    type Renderer,
    type RenderModel
} from "@/lib/signal-visualizer/core/Renderer.ts";
import type {SampledSignalSource} from "@/lib/signal-visualizer/application/SampledSignalSource.ts";

export class Interpreter {
    private renderer: Renderer
    private htmlElement: HTMLElement
    private renderModel: RenderModel
    private signalsSource: SampledSignalSource

    constructor(renderer: Renderer, container: HTMLElement, signalsSource: SampledSignalSource) {
        this.renderer = renderer;
        this.signalsSource = signalsSource;
        this.htmlElement = container;
        this.htmlElement.appendChild(this.renderer.canvas);
        this.renderModel = {
            width: container.clientWidth,
            height: container.clientHeight,
            oneDimSignals : this.fetchData(0, signalsSource.totalSamples)
        }
    }

    async destroy(): Promise<void> {
        this.renderer.destroy();
    }

     fetchData(sampleStart: number, n: number): OneDimSignals {
        const data = this.signalsSource.read(sampleStart, n)

        const samples = new Float32Array(n)
        for (let i = 0; i < n; i++) {
            samples[i] = ((sampleStart + i) / this.signalsSource.samplingFrequency)
        }
        return new OneDimSignals(samples, data)
    }

    async updateData(sampleStart: number, n: number): Promise<void> {
        const signalData = this.fetchData(sampleStart, n)
        await this.renderer.draw(
            {
                width: this.renderModel.width,
                height: this.renderModel.height,
                oneDimSignals: signalData
            }
        )
    }
    async resize(width: number, height: number) {
        await this.renderer.draw({
                width: width,
                height: height,
                oneDimSignals: this.renderModel.oneDimSignals
            }
        )
    }
}
