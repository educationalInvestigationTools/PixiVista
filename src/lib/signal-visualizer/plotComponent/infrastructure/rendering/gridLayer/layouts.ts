import type { MinMaxValues } from '@/lib/signal-visualizer/plotComponent/application/types/minMaxValues.ts'

export type VerticalLabelsSide = 'left' | 'right'
export type HorizontalLabelsSide = 'up' | 'down'
export type GridLabelFormatter = (value: number) => string

export type VerticalLabelsBuildData = {
    minMaxValues: MinMaxValues
    side: VerticalLabelsSide
    formatter: GridLabelFormatter
}

export type HorizontalLabelsBuildData = {
    minMaxValues: MinMaxValues
    side: HorizontalLabelsSide
    formatter: GridLabelFormatter
}
