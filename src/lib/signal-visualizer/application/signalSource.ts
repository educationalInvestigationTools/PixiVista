export class ViewPort {
    startSeconds: number
    readonly lengthSeconds: number

    constructor(startSeconds: number, lengthSeconds: number) {
        this.startSeconds = startSeconds
        this.lengthSeconds = lengthSeconds
    }

    updateStartSeconds(startSeconds: number) {
        this.startSeconds = startSeconds
    }
}

export type One1DSignal = {
    xValues: Float32Array
    yValues: Float32Array
}

export interface SignalSource {
    readonly totalSeconds: number
    readonly label: string
    read(viewport: ViewPort): One1DSignal
}
