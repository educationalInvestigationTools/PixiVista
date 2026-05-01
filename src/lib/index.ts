export { buildWorkerRunTime } from '@/plotComponent/domain/dataManager/workerRunTime'

export {
    SignalSourceBuildData,
    SignalSourceManager,
} from '@/plotComponent/application/interfaces/signalSource.ts'
export type {
    OneDimSignalRaw,
    SerializedOutput,
    SignalSource,
    SignalSourceBuildDataSerializer,
    SignalSourceFactory,
} from '@/plotComponent/application/interfaces/signalSource.ts'

export type { ViewPort } from '@/plotComponent/application/types/viewPort'

export type {
    HighlightedInterval,
    IntervalGroup,
} from '@/plotComponent/application/types/highlightedInterval'

export { default as PlotComponent } from '@/plotComponent/presentation/plotComponent/PlotComponent.vue'
