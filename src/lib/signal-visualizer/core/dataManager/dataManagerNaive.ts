import type { SignalSource, SignalSourceBuildData } from "../../application/types/signalSource";
import type { ViewPort } from "../../application/types/viewPort";
import { MockSignalSourceBuilder, type MockSignalSourceConstructor } from "../../infrastructure/signals/mockSignalSource";
import { Envelope } from "../../utils/envelope";
import { largestTriangleThreeBuckets } from "../../utils/lttb";
import type { OneDimNormalizedSignal, NormalizedSignal } from "../types";
import { DataManager } from "./dataManager";


export class DataManagerNaive extends DataManager {
    private readonly signalSources: Record<string, SignalSource>;

    constructor(signalsSourceBuildData: SignalSourceBuildData[]) {
        super(signalsSourceBuildData);
        this.signalSources = signalsSourceBuildData.reduce<Record<string, SignalSource>>((acc, buildData) => {
            if (buildData.signalSourceType === 'MockSignalSource') {
                const builder = new MockSignalSourceBuilder();
                acc[buildData.label] = builder.build(buildData as MockSignalSourceConstructor);
            }
            return acc;
        }, {});
    }

    async fetchData(labels: string[], viewPort: ViewPort, expectedWidth: number): Promise<OneDimNormalizedSignal[]> {
        const promises = labels.map(x => this.fetchSingleData(x, viewPort, expectedWidth));
        return Promise.all(promises);
    }

    private async fetchSingleData(label: string, viewPort: ViewPort, expectedWidth: number): Promise<OneDimNormalizedSignal> {
        const signalSource = this.signalSources[label]!;
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
