export interface SampledSignalSource {
    totalSamples: number
    samplingFrequency: number
    numberOfSignals: number
    read(sampleStart: number, n: number): Float32Array[]
}
