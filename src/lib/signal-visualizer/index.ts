export { buildWorkerRunTime } from '@/lib/signal-visualizer/plotComponent/domain/dataManager/workerRunTime'

export {
    SignalSourceBuildData,
    SignalSourceManager,
} from '@/lib/signal-visualizer/plotComponent/application/interfaces/signalSource.ts'
export type {
    OneDimSignalRaw,
    SerializedOutput,
    SignalSource,
    SignalSourceBuildDataSerializer,
    SignalSourceFactory,
} from '@/lib/signal-visualizer/plotComponent/application/interfaces/signalSource.ts'

export type { ViewPort } from '@/lib/signal-visualizer/plotComponent/application/types/viewPort'

export type {
    HighlightedInterval,
    IntervalGroup,
} from '@/lib/signal-visualizer/plotComponent/application/types/highlightedInterval'

export { default as PlotComponent } from '@/lib/signal-visualizer/plotComponent/presentation/plotComponent/PlotComponent.vue'
