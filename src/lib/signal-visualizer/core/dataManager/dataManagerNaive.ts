import type { SignalSource, SignalSourceManager } from "../../application/types/signalSource";
import type { ViewPort } from "../../application/types/viewPort";
import { Envelope } from "../../utils/envelope";
import { largestTriangleThreeBuckets } from "../../utils/lttb";
import type { OneDimNormalizedSignal, NormalizedSignal } from "../types";

export class DataManagerNaive {
    private readonly signalSources: Map<string, SignalSource> = new Map()

    constructor(signalSourceManager: SignalSourceManager) {
        const signalSources = signalSourceManager.createSignalSources()
        for (const signalSource of signalSources) {
            this.signalSources.set(signalSource.label, signalSource)
        }
    }

    async fetchData(labels: string[], viewPort: ViewPort, expectedWidth: number): Promise<OneDimNormalizedSignal[]> {
        const promises = labels.map(x => this.fetchSingleData(x, viewPort, expectedWidth));
        return Promise.all(promises);
    }

    private async fetchSingleData(label: string, viewPort: ViewPort, expectedWidth: number): Promise<OneDimNormalizedSignal> {
        const signalSource = this.signalSources.get(label)!;
        const data = await signalSource.read(viewPort);
        const dataToUse = largestTriangleThreeBuckets(data, expectedWidth);
        const xEnvelope = new Envelope(dataToUse.xValues, {
            min: viewPort.startSeconds,
            max: viewPort.startSeconds + viewPort.lengthSeconds,
        });
        const xAxisSignal: NormalizedSignal = {
            values: xEnvelope.normalized,
            minMaxValues: {
                min: xEnvelope.min,
                max: xEnvelope.max,
            },
        };
        const yEnvelope = new Envelope(dataToUse.yValues);
        const yAxisSignal: NormalizedSignal = {
            values: yEnvelope.normalized,
            minMaxValues: {
                min: yEnvelope.min,
                max: yEnvelope.max,
            },
        };
        return Promise.resolve({
            label: signalSource.label,
            xSignal: xAxisSignal,
            ySignal: yAxisSignal,
        });
    }
}
