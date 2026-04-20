import type { ChartValuePoint } from '@/lib/signal-visualizer/metricsComponent/application/types/chartValuePoint.ts'

export type MetricsChartSnapshot = {
    title: string
    unit: string
    points: ChartValuePoint[]
    minValue: number
    maxValue: number
    currentValue: number
    lineColor: string
    fillColor: string
    gridColor: string
}

export type MetricsChartsSnapshot = {
    refreshRateChart: MetricsChartSnapshot
    renderTimeChart: MetricsChartSnapshot
}
