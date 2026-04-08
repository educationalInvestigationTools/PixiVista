import type { SignalSourceBuildData } from "../../application/types/signalSource";
import type { ViewPort } from "../../application/types/viewPort";
import type { OneDimNormalizedSignal } from "../types";

export abstract class DataManager {
    signalsSourceBuildData: SignalSourceBuildData[]
    constructor(signalsSourceBuildData: SignalSourceBuildData[]) {
        this.signalsSourceBuildData = signalsSourceBuildData
    }
    abstract fetchData(labels: string[], viewPort: ViewPort, expectedWidth: number): Promise<OneDimNormalizedSignal[]>
}


