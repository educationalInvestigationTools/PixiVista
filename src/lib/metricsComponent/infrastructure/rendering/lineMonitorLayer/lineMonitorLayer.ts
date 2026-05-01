import type { LayoutDesign } from "@/core/rendering/layoutDesign"
import { RenderLayer } from "@/core/rendering/renderLayer"
import type { Point2D } from "@/core/types/point2D"
import type { SizeData } from "@/core/types/sizeData"
import type { MetricsChartStyle } from "@/metricsComponent/infrastructure/rendering/chartLayer/types/metricsChartStyle"
import { LineMonitorLayout } from "@/metricsComponent/infrastructure/rendering/lineMonitorLayer/lineMonitorLayout"

export class LineMonitorLayer extends RenderLayer<LineMonitorLayout> {
    private style: MetricsChartStyle
    private normalizedPoints: Point2D[] = []

    constructor(style: MetricsChartStyle) {
        super(new LineMonitorLayout())
        this.style = style
    }

    get Children(): RenderLayer<LayoutDesign>[] {
        return []
    }

    updatePointsData(points: Point2D[]) {
        this.normalizedPoints = points
        this._needsRendering = true
    }

    _updatePosition(positionData: Point2D): void {
        this.layoutDesign.updatePosData(positionData)
    }

    _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
    }

    private mapYValue(value: number) {
        return this.layoutDesign.height - value * this.layoutDesign.height
    }

    private mapXValue(value: number) {
        return value * this.layoutDesign.width
    }

    protected _draw(): void {
        if (this.normalizedPoints.length === 0) {
            return
        }
        const mappedPoints = this.normalizedPoints.map((point) => ({
            x: this.mapXValue(point.x),
            y: this.mapYValue(point.y),
        }))

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

    protected _destroy(): void {

    }
}
