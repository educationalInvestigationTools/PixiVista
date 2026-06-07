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

export { default as PlotComponent } from '@/plotComponent/presentation/plotComponent/PlotComponent.vue'
