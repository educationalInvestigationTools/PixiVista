import {
    type SignalSource,
    type OneDimSignalRaw,
    type SignalSourceBuildData,
    type SignalSourceBuilder,
} from '@/lib/signal-visualizer/application/types/signalSource.ts'
import { ViewPort } from '@/lib/signal-visualizer/application/types/viewPort.ts'

export type MockSignalSourceConstructor = SignalSourceBuildData & {
    signalSourceType: 'MockSignalSource'
    samplingFrequency: number
    totalSeconds: number
}

export class MockSignalSourceBuilder implements SignalSourceBuilder<MockSignalSourceConstructor> {
    build(buildData: MockSignalSourceConstructor): MockSignalSource {
        return new MockSignalSource(buildData)
    }
}

export class MockSignalSource implements SignalSource {
    private readonly samplingFrequency: number
    private readonly totalSamples: number
    private readonly _label: string
    private readonly data: Float32Array

    constructor(data: MockSignalSourceConstructor) {
        this.samplingFrequency = data.samplingFrequency
        this.totalSamples = Math.floor(data.samplingFrequency * data.totalSeconds)
        this._label = data.label
        this.data = new Float32Array(
            Array.from({ length: this.totalSamples }, () => Math.random()).map(
                (v, i) => v * Math.sin((i / this.totalSamples) * 360),
            ),
        )
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
            xValues[i] = startSeconds + i / this.samplingFrequency
            yValues[i] = this.data[startSample + i]!
        }
        return {
            xValues: xValues,
            yValues: yValues,
        }
    }
}
