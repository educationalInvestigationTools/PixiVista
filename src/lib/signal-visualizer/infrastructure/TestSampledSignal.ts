import type {SampledSignalSource} from "@/lib/signal-visualizer/application/SampledSignalSource.ts";

export class TestSignalSource implements SampledSignalSource {
    samplingFrequency: number;
    totalSamples: number;
    numberOfSignals: number;

    constructor(samplingFrequency: number, totalSamples: number, numberOfSignals: number) {
        this.samplingFrequency = samplingFrequency;
        this.totalSamples = totalSamples;
        this.numberOfSignals = numberOfSignals
    }

    read(sampleStart: number, n: number): Float32Array[] {
        const result = [];
        for (let j = 0; j < this.numberOfSignals; j++) {
            const data = new Float32Array(n)
            for (let i = 0; i < n; i++) {
                data[i] = Math.sin(i * this.totalSamples / this.samplingFrequency)
            }
            result.push(data)
        }
        return result
    }
}
