import type { ViewPort } from '@/plotComponent/application/types/viewPort.ts'

export type OneDimSignalRaw = {
    xValues: Float32Array
    yValues: Float32Array
}

export class SignalSourceBuildData {
    readonly totalSeconds: number
    readonly label: string

    constructor(totalSeconds: number, label: string) {
        this.totalSeconds = totalSeconds
        this.label = label
    }
}

export type SerializedOutput = string

export interface SignalSourceBuildDataSerializer<T extends SignalSourceBuildData> {
    readonly serializerId: string

    serialize(value: T): SerializedOutput

    deserialize(serializedValue: SerializedOutput): T
}

export interface SignalSource {
    label: string

    read(viewport: ViewPort): Promise<OneDimSignalRaw>
}

export interface SignalSourceFactory<M extends SignalSourceBuildData, T extends SignalSource> {
    build(buildData: M): T
}

export class SignalSourceManager {
    private serializers: Map<string, SignalSourceBuildDataSerializer<SignalSourceBuildData>> =
        new Map()
    private signalsBuildData: Map<string, SignalSourceBuildData[]> = new Map()
    private factories: Map<string, SignalSourceFactory<SignalSourceBuildData, SignalSource>> =
        new Map()

    addSerializer(serializer: SignalSourceBuildDataSerializer<SignalSourceBuildData>) {
        this.serializers.set(serializer.serializerId, serializer)
    }

    addSignalBuildData(serializerId: string, signalBuildData: SignalSourceBuildData) {
        if (!this.signalsBuildData.has(serializerId)) {
            this.signalsBuildData.set(serializerId, [])
        }
        const array = this.signalsBuildData.get(serializerId)
        array?.push(signalBuildData)
    }

    addFactory(
        serializerId: string,
        factory: SignalSourceFactory<SignalSourceBuildData, SignalSource>,
    ) {
        this.factories.set(serializerId, factory)
    }

    get allSignalsBuildData(): SignalSourceBuildData[] {
        let result: SignalSourceBuildData[] = []
        for (const [_, signalsBuildData] of this.signalsBuildData) {
            result = result.concat(signalsBuildData)
        }
        return result
    }

    createSignalSources(): SignalSource[] {
        const result: SignalSource[] = []
        for (const [serializerId, factory] of this.factories) {
            const signalsBuildData = this.signalsBuildData.get(serializerId)
            if (signalsBuildData !== undefined) {
                for (const buildData of signalsBuildData) {
                    result.push(factory.build(buildData))
                }
            }
        }
        return result
    }

    serialize(): SerializedOutput {
        const result: Map<string, SerializedOutput[]> = new Map()
        for (const [serializerId, serializer] of this.serializers) {
            const signalsBuildData = this.signalsBuildData.get(serializerId)
            if (signalsBuildData !== undefined) {
                result.set(
                    serializerId,
                    signalsBuildData.map((x) => serializer.serialize(x)),
                )
            }
        }
        return JSON.stringify(Object.fromEntries(result))
    }

    deSerialize(value: SerializedOutput) {
        const result: Map<string, SerializedOutput[]> = new Map(Object.entries(JSON.parse(value)))
        for (const [serializerId, serializer] of this.serializers) {
            const serializedSignals = result.get(serializerId)
            if (serializedSignals !== undefined) {
                serializedSignals.map((x) =>
                    this.addSignalBuildData(serializerId, serializer.deserialize(x)),
                )
            }
        }
    }
}
