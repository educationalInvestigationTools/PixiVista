import {
    type CompatibleSignal,
    type One1DSignal,
    ViewPort
} from "@/lib/signal-visualizer/application/SignalSource.ts";

export class TestSignalSource implements CompatibleSignal {
    private readonly samplingFrequency: number;
    private readonly totalSamples: number;

    constructor(samplingFrequency: number, totalSamples: number) {
        this.samplingFrequency = samplingFrequency;
        this.totalSamples = totalSamples;
    }

    get totalSeconds(): number {
        return this.totalSamples / this.samplingFrequency
    }

    read(viewport: ViewPort): One1DSignal {
        const startSeconds = viewport.startSeconds
        const endSeconds = startSeconds + viewport.lengthSeconds
        const startSample = this.samplingFrequency * startSeconds
        const endSample = Math.min(this.samplingFrequency * (endSeconds), this.totalSamples - 1)
        const n = endSample - startSample + 1
        const xValues = new Float32Array(n)
        const yValues = new Float32Array(n)
        for (let i = 0; i < n; i++) {
            yValues[i] = Math.sin((i / n) * 360)
            xValues[i] = startSeconds + (i / this.samplingFrequency)
        }
        return {
            xValues: xValues,
            yValues: yValues
        }
    }
}
