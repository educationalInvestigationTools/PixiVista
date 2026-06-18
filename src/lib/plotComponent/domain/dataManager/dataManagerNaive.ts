import type { SignalSource, SignalSourceManager, ViewPort } from "@/index"
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

        const xMinMaxValues = {
            min: viewPort.startSeconds,
            max: viewPort.startSeconds + viewPort.lengthSeconds,
        }
        /*
        The x coordinates should use as min, max values the ones from the viewport, even though those may be not accurate. Observe that in the y-coordinate I do use the min, max from the signal values.
        */
        const xNormalizedValues = Envelope.normalizeCoords(dataToUse.xValues, xMinMaxValues)
        const xAxisSignal = xNormalizedValues

        const yNormalizedValues = Envelope.normalizeCoords(dataToUse.yValues)
        const yAxisSignal = yNormalizedValues
        return Promise.resolve({
            label: signalSource.label,
            xSignal: xAxisSignal,
            ySignal: yAxisSignal,
        })
    }
}
