import type { OneDimNormalizedSignal } from '@/lib/signal-visualizer/plotComponent/application/types/oneDimNormalizedSignal.ts'

export type ReceivedRequest = {
    requestId: string
    signalsData: OneDimNormalizedSignal[]
}
