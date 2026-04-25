import { Observer } from "../../core/observer";
import type { MetricsComponentApi } from "./metricsComponentApi";
import type { MetricsState } from "./metricsState";
import { areEqual, clone, type MetricsTimeStamp } from "./metricsTimeStamp";

export class MetricsObserver extends Observer<MetricsTimeStamp> {
    private readonly state: MetricsState
    private readonly componentApi: MetricsComponentApi
    constructor(state: MetricsState, componentApi: MetricsComponentApi) {
        super(areEqual, clone, () => { return { timeStampMs: state.TimeStampMs } }, 30)
        this.componentApi = componentApi
        this.state = state
    }

    update(_currentObserved: MetricsTimeStamp): Promise<void> {
        const currentState = this.state.CurrentState
        this.componentApi.updateCharts(currentState)
        return Promise.resolve()
    }
    async destroy(): Promise<void> { }
}
