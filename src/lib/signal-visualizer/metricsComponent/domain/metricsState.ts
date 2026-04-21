export type MetricsSample = {
    timestampMs: number
    renderTimeMs: number
    refreshRateFps: number
}

export class MetricsState {
    private samples: MetricsSample[] = []
    private readonly windowMs: number

    constructor(windowMs: number) {
        this.windowMs = windowMs
    }

    pushSample(sample: MetricsSample) {
        this.samples.push(sample)
        this.trimSamples()
        return this.samples
    }

    private trimSamples() {
        if (this.samples.length === 0) {
            return
        }
        const latestTimestamp = this.samples[this.samples.length - 1]!.timestampMs
        const cutoff = latestTimestamp - this.windowMs
        while (this.samples.length > 0 && this.samples[0]!.timestampMs < cutoff) {
            this.samples.shift()
        }
    }

    get WindowMs() {
        return this.windowMs
    }
}
