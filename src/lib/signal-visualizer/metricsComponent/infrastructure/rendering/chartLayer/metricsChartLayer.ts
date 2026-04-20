import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import { MetricsChartLayout } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/chartLayer/layout.ts'
import type { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { MetricsChartSnapshot } from '@/lib/signal-visualizer/metricsComponent/application/types/metricsChartSnapshot.ts'
import { Text } from 'pixi.js'

const GRID_VERTICAL_DIVISIONS = 6
const GRID_HORIZONTAL_DIVISIONS = 4

export class MetricsChartLayer extends RenderLayer<MetricsChartLayout> {
    private snapshot: MetricsChartSnapshot
    private labels: Text[] = []

    constructor(layoutData: MetricsChartLayout, snapshot: MetricsChartSnapshot) {
        super(layoutData)
        this.snapshot = snapshot
    }

    get Children(): RenderLayer<LayoutDesign>[] {
        return []
    }

    updateSnapshot(snapshot: MetricsChartSnapshot) {
        this.snapshot = snapshot
        this._needsRendering = true
    }

    _updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
    }

    _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
    }

    private clearLabels() {
        for (const label of this.labels) {
            this.container.removeChild(label)
            label.destroy()
        }
        this.labels = []
    }

    private addLabel(
        value: string,
        x: number,
        y: number,
        align: 'left' | 'right',
        color: string,
        fontSize: number,
    ) {
        const label = new Text({
            text: value,
            style: {
                fill: color,
                fontFamily: 'JetBrains Mono, Menlo, monospace',
                fontSize,
                fontWeight: '600',
            },
        })
        label.x = align === 'left' ? x : x - label.width
        label.y = y
        this.container.addChild(label)
        this.labels.push(label)
    }

    private mapYValue(value: number) {
        const minValue = this.snapshot.minValue
        const maxValue = this.snapshot.maxValue
        const range = Math.max(maxValue - minValue, 0.001)
        const normalized = clamp((value - minValue) / range, 0, 1)
        return this.layoutDesign.plotBottom - normalized * this.layoutDesign.plotHeight
    }

    protected _draw(): void {
        this.clearLabels()

        this.graphics
            .rect(0, 0, this.layoutDesign.width, this.layoutDesign.height)
            .fill({ color: '#06090d', alpha: 1 })
            .stroke({ color: '#2f3a48', width: 1, alpha: 0.8 })

        const plotX = this.layoutDesign.plotX
        const plotY = this.layoutDesign.plotY
        const plotWidth = this.layoutDesign.plotWidth
        const plotHeight = this.layoutDesign.plotHeight

        this.graphics
            .rect(plotX, plotY, plotWidth, plotHeight)
            .fill({ color: '#0d131a', alpha: 1 })
            .stroke({ color: '#1f2937', width: 1, alpha: 1 })

        for (let i = 0; i <= GRID_VERTICAL_DIVISIONS; i++) {
            const ratio = i / GRID_VERTICAL_DIVISIONS
            const x = plotX + ratio * plotWidth
            this.graphics.moveTo(x, plotY).lineTo(x, this.layoutDesign.plotBottom).stroke({
                color: this.snapshot.gridColor,
                width: 1,
                alpha: 0.14,
            })
        }

        for (let i = 0; i <= GRID_HORIZONTAL_DIVISIONS; i++) {
            const ratio = i / GRID_HORIZONTAL_DIVISIONS
            const y = plotY + ratio * plotHeight
            this.graphics.moveTo(plotX, y).lineTo(this.layoutDesign.plotRight, y).stroke({
                color: this.snapshot.gridColor,
                width: 1,
                alpha: 0.18,
            })
        }

        const mappedPoints = this.snapshot.points.map((point) => ({
            x: plotX + point.x * plotWidth,
            y: this.mapYValue(point.value),
        }))

        if (mappedPoints.length > 0) {
            const firstPoint = mappedPoints[0]!
            const lastPoint = mappedPoints[mappedPoints.length - 1]!

            this.graphics.moveTo(firstPoint.x, this.layoutDesign.plotBottom)
            for (const point of mappedPoints) {
                this.graphics.lineTo(point.x, point.y)
            }
            this.graphics.lineTo(lastPoint.x, this.layoutDesign.plotBottom)
            this.graphics.lineTo(firstPoint.x, this.layoutDesign.plotBottom)
            this.graphics.fill({ color: this.snapshot.fillColor, alpha: 0.45 })

            if (mappedPoints.length === 1) {
                this.graphics.circle(firstPoint.x, firstPoint.y, 2.5).fill({
                    color: this.snapshot.lineColor,
                    alpha: 1,
                })
            } else {
                this.graphics.moveTo(firstPoint.x, firstPoint.y)
                for (let i = 1; i < mappedPoints.length; i++) {
                    const point = mappedPoints[i]!
                    this.graphics.lineTo(point.x, point.y)
                }
                this.graphics.stroke({
                    color: this.snapshot.lineColor,
                    width: 2,
                    alpha: 1,
                    cap: 'round',
                    join: 'round',
                })
                this.graphics.circle(lastPoint.x, lastPoint.y, 2.5).fill({
                    color: this.snapshot.lineColor,
                    alpha: 1,
                })
            }
        }

        const titleFontSize = Math.max(11, Math.floor(this.layoutDesign.height * 0.1))
        const valueFontSize = Math.max(11, Math.floor(this.layoutDesign.height * 0.12))
        const metadataFontSize = Math.max(10, Math.floor(this.layoutDesign.height * 0.09))

        const currentValueText = `${this.snapshot.currentValue.toFixed(2)} ${this.snapshot.unit}`
        const rangeText = `${this.snapshot.minValue.toFixed(0)} to ${this.snapshot.maxValue.toFixed(0)} ${this.snapshot.unit}`

        this.addLabel(this.snapshot.title, plotX, 2, 'left', '#d1d5db', titleFontSize)
        this.addLabel(currentValueText, this.layoutDesign.plotRight, 2, 'right', '#f3f4f6', valueFontSize)
        this.addLabel(
            rangeText,
            this.layoutDesign.plotRight,
            this.layoutDesign.plotBottom + 2,
            'right',
            '#9ca3af',
            metadataFontSize,
        )
    }
}

function clamp(value: number, minValue: number, maxValue: number) {
    if (value < minValue) {
        return minValue
    }
    if (value > maxValue) {
        return maxValue
    }
    return value
}
