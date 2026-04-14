export { buildWorkerRunTime } from './core/dataManager/workerRunTime'

export { SignalSourceBuildData, SignalSourceManager } from './application/types/signalSource'
export type {
    OneDimSignalRaw,
    SerializedOutput,
    SignalSource,
    SignalSourceBuildDataSerializer,
    SignalSourceFactory,
} from './application/types/signalSource'

export type { ViewPort } from './application/types/viewPort'

export type { HighlightedInterval, IntervalGroup } from './application/types/highlightedInterval'

export { default as PlotComponent } from './presentation/plotComponent/PlotComponent.vue'
