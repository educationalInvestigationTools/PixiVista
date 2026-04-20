import type { NormalizedSignal } from '@/lib/signal-visualizer/plotComponent/application/types/normalizedSignal.ts'

export type OneDimNormalizedSignal = {
    label: string
    xSignal: NormalizedSignal
    ySignal: NormalizedSignal
}
