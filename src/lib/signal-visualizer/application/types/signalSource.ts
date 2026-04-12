import type { ViewPort } from "./viewPort"

export type OneDimSignalRaw = {
    xValues: Float32Array
    yValues: Float32Array
}

/*
Every signal source S should provide a type f(S) such that with f(S) S can be constructed, and f(S) is serializable, also every signal source should provide a way to instantiate f(S) to the client.
*/

export type SignalSourceBuildData = {
    readonly signalSourceType: string
    readonly totalSeconds: number
    readonly label: string
}

export interface SignalSourceBuilder<T extends SignalSourceBuildData> {
    build(buildData: T): SignalSource
}

export interface SignalSource {
    label: string
    read(viewport: ViewPort): Promise<OneDimSignalRaw>
}
