import type {
    SignalSource,
    SignalSourceManager,
} from '@/lib/signal-visualizer/plotComponent/application/interfaces/signalSource.ts'
import type { ViewPort } from '@/lib/signal-visualizer/plotComponent/application/types/viewPort.ts'
import { Envelope } from '../../utils/envelope.ts'
import { largestTriangleThreeBuckets } from '../../utils/lttb.ts'
import type { DataManager } from './dataManager.ts'
import type { NormalizedSignal } from '@/lib/signal-visualizer/plotComponent/application/types/normalizedSignal.ts'
import type { OneDimNormalizedSignal } from '@/lib/signal-visualizer/plotComponent/application/types/oneDimNormalizedSignal.ts'

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
