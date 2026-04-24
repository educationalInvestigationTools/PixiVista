import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { MetricsChartStyle } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/chartLayer/types/metricsChartSnapshot'
import { clamp } from '@/lib/signal-visualizer/utils/utils'
import type { PointsData } from './types/pointsData'

export class LineMonitorLayout extends LayoutDesign {}

export class LineMonitorLayer extends RenderLayer<LineMonitorLayout> {
    private style: MetricsChartStyle
    private pointsData : PointsData

    constructor(layoutData: LineMonitorLayout, style: MetricsChartStyle, pointsData : PointsData) {
        super(layoutData)
        this.style = style
        this.pointsData = pointsData
    }

    get Children(): RenderLayer<LayoutDesign>[] {
        return []
    }

    updatePointsData(pointsData : PointsData) {
        this.pointsData = pointsData
        this._needsRendering = true
    }

    _updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
    }

    _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
    }

    private mapYValue(value: number) {
        const minValue = this.pointsData.minValue
        const maxValue = this.pointsData.maxValue
        const range = Math.max(maxValue - minValue, 0.001)
        const normalized = clamp((value - minValue) / range, 0, 1)
        return this.layoutDesign.height - normalized * this.layoutDesign.height
    }

    private mapXValue(value: number) {
        return clamp(value, 0, 1) * this.layoutDesign.width
    }

    protected _draw(): void {
        const mappedPoints = this.pointsData.points.map((point) => ({
            x: this.mapXValue(point.x),
            y: this.mapYValue(point.y),
        }))

        if (this.pointsData.points.length === 0) {
            return
        }

        const firstPoint = mappedPoints[0]!
        const lastPoint = mappedPoints[mappedPoints.length - 1]!
        const plotBottom = this.layoutDesign.height

        this.graphics.moveTo(firstPoint.x, plotBottom)
        for (const point of mappedPoints) {
            this.graphics.lineTo(point.x, point.y)
        }
        this.graphics.lineTo(lastPoint.x, plotBottom)
        this.graphics.lineTo(firstPoint.x, plotBottom)
        this.graphics.fill({ color: this.style.fillColor, alpha: 0.45 })

        if (mappedPoints.length === 1) {
            this.graphics.circle(firstPoint.x, firstPoint.y, 2.5).fill({
                color: this.style.lineColor,
                alpha: 1,
            })
            return
        }

        this.graphics.moveTo(firstPoint.x, firstPoint.y)
        for (let i = 1; i < mappedPoints.length; i++) {
            const point = mappedPoints[i]!
            this.graphics.lineTo(point.x, point.y)
        }
        this.graphics.stroke({
            color: this.style.lineColor,
            width: 2,
            alpha: 1,
            cap: 'round',
            join: 'round',
        })
        this.graphics.circle(lastPoint.x, lastPoint.y, 2.5).fill({
            color: this.style.lineColor,
            alpha: 1,
        })
    }
}
