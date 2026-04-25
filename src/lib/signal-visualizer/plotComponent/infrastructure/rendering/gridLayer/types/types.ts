import type { MinMaxValues } from "@/lib/signal-visualizer/plotComponent/application/types/minMaxValues"

export type VerticalLabelsSide = 'left' | 'right'
export type HorizontalLabelsSide = 'up' | 'down'
export type GridLabelFormatter = (value: number) => string


export type LabelsDirectionConfig<TSide> =
    | {
          include: false
      }
    | {
          include: true
          side: TSide
          formatter: GridLabelFormatter
      }

export type GridLabelsConfig = {
    vertical: LabelsDirectionConfig<VerticalLabelsSide>
    horizontal: LabelsDirectionConfig<HorizontalLabelsSide>
}

export type GridLabelsMinMaxValues = {
    vertical: MinMaxValues
    horizontal: MinMaxValues
}
