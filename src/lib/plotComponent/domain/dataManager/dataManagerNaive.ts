import type { SignalSource, SignalSourceManager, ViewPort } from "@/index"
import type { NormalizedSignal } from "@/plotComponent/application/types/normalizedSignal"
import type { OneDimNormalizedSignal } from "@/plotComponent/application/types/oneDimNormalizedSignal"
import type { DataManager } from "@/plotComponent/domain/dataManager/dataManager"
import { Envelope } from "@/plotComponent/utils/envelope"
import { largestTriangleThreeBuckets } from "@/plotComponent/utils/lttb"


export class DataManagerNaive implements DataManager {
    private readonly signalSources: Map<string, SignalSource> = new Map()

    constructor(signalSourceManager: SignalSourceManager) {
        const signalSources = signalSourceManager.createSignalSources()
        for (const signalSource of signalSources) {
            this.signalSources.set(signalSource.label, signalSource)
        }
    }

    async fetchData(
        labels: string[],
        viewPort: ViewPort,
        expectedWidth: number,
    ): Promise<OneDimNormalizedSignal[]> {
        const promises = labels.map((x) => this.fetchSingleData(x, viewPort, expectedWidth))
        return Promise.all(promises)
    }

    private async fetchSingleData(
        label: string,
        viewPort: ViewPort,
        expectedWidth: number,
    ): Promise<OneDimNormalizedSignal> {
        const signalSource = this.signalSources.get(label)!
        const data = await signalSource.read(viewPort)
        const dataToUse = largestTriangleThreeBuckets(data, expectedWidth)
        const xEnvelope = new Envelope(dataToUse.xValues, {
            min: viewPort.startSeconds,
            max: viewPort.startSeconds + viewPort.lengthSeconds,
        })
        const xAxisSignal: NormalizedSignal = {
            values: xEnvelope.normalized,
            minMaxValues: {
                min: xEnvelope.min,
                max: xEnvelope.max,
            },
        }
        const yEnvelope = new Envelope(dataToUse.yValues)
        const yAxisSignal: NormalizedSignal = {
            values: yEnvelope.normalized,
            minMaxValues: {
                min: yEnvelope.min,
                max: yEnvelope.max,
            },
        }
        return Promise.resolve({
            label: signalSource.label,
            xSignal: xAxisSignal,
            ySignal: yAxisSignal,
        })
    }
}
