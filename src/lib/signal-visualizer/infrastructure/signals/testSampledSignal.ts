import {
    type SignalSource,
    type OneDimSignalRaw,
    ViewPort,
} from '@/lib/signal-visualizer/application/signalSource.ts'

export class TestSignalSource implements SignalSource {
    private readonly samplingFrequency: number
    private readonly totalSamples: number
    private readonly _label: string
    private randomSeed : number[]

    constructor(label: string, samplingFrequency: number, totalSamples: number) {
        this.samplingFrequency = samplingFrequency
        this.totalSamples = totalSamples
        this._label = label
        this.randomSeed = Array.from({ length: totalSamples }, () => Math.random())
    }

    get totalSeconds(): number {
        return this.totalSamples / this.samplingFrequency
    }

    get label(): string {
        return this._label
    }

    read(viewport: ViewPort): OneDimSignalRaw {
        const startSeconds = viewport.startSeconds
        const endSeconds = startSeconds + viewport.lengthSeconds
        const startSample = this.samplingFrequency * startSeconds
        const endSample = Math.min(this.samplingFrequency * endSeconds, this.totalSamples - 1)
        const n = Math.max(0, endSample - startSample + 1)
        const xValues = new Float32Array(n)
        const yValues = new Float32Array(n)
        for (let i = 0; i < n; i++) {
            yValues[i] = this.randomSeed[i]! * Math.sin((i / n) * 360)
            xValues[i] = startSeconds + i / this.samplingFrequency
        }
        return {
            xValues: xValues,
            yValues: yValues,
        }
    }
}
