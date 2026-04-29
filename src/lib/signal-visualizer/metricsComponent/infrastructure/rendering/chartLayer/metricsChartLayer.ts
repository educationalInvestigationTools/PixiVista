import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import type { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { MetricsChartStyle } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/chartLayer/types/metricsChartStyle.ts'
import { GridLayer} from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/gridLayer.ts'
import { LineLabelsLayer } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/lineLabelsLayer/lineLabelsLayer.ts'
import type { LineLayerDescription } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/lineLabelsLayer/types/lineLayerDescription.ts'
import { LineMonitorLayer } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/lineMonitorLayer/lineMonitorLayer'
import { MetricsChartLayout } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/chartLayer/metricsChartLayout.ts'
import type { PointsData } from '../../../domain/types/pointsData'
import { formatSecondsAsMinuteSeconds } from '@/lib/signal-visualizer/utils/utils'
import type { Point2D } from '@/lib/signal-visualizer/core/types/point2D'

export class MetricsChartLayer extends RenderLayer<MetricsChartLayout> {
    private style: MetricsChartStyle
    private pointsData: PointsData
    private readonly gridLayer: GridLayer
    private readonly lineMonitorLayer: LineMonitorLayer
    private readonly headerLabelsLayer: LineLabelsLayer

    constructor(style: MetricsChartStyle) {
        super(new MetricsChartLayout())
        this.style = style
        this.pointsData = {
            points: [],
            minValue: 0,
            maxValue: 0,
            currentValue: 0,
        }

        this.gridLayer = new GridLayer()
        this.gridLayer.addLabelSide('left', (arg0: number) => this.verticalLabelTextAt(arg0))
        this.gridLayer.addLabelSide('down', (arg0: number) => this.horizontalLabelTextAt(arg0))

        this.lineMonitorLayer = new LineMonitorLayer(
            style,
        )

        const headerLabelDescription: LineLayerDescription = {
            positionsNormalized: [0, 1],
            orientation: 'horizontal',
            alignmentCallback: (index: number, length: number) => {
                if (index === 0) {
                    return 'left'
                }
                if (index === length - 1) {
                    return 'right'
                }
                return 'center'
            },
        }
        this.headerLabelsLayer = new LineLabelsLayer(headerLabelDescription)
        this.updateHeaderLabels()

        this.container.addChild(this.gridLayer.container)
        this.container.addChild(this.lineMonitorLayer.container)
        this.container.addChild(this.headerLabelsLayer.container)
    }

    get Children(): RenderLayer<LayoutDesign>[] {
        return [this.gridLayer, this.lineMonitorLayer, this.headerLabelsLayer]
    }

    updatePointsData(pointsData: PointsData) {
        this.pointsData = pointsData
        this.updateGridLabels()
        this.updateHeaderLabels()
        this.updatePointsLineMonitorLayer()
        this._needsRendering = true
    }

    _updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
        this.gridLayer.updatePosition(this.layoutDesign.buildPlotPositionData())
        this.relayoutLineMonitor()
        this.relayoutHeaderLabels()
    }

    _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
        this.gridLayer.updateSize(this.layoutDesign.buildPlotSizeData())
        this.gridLayer.updatePosition(this.layoutDesign.buildPlotPositionData())

        this.relayoutLineMonitor()
        this.updateGridLabels()
        this.relayoutHeaderLabels()
    }

    protected _draw(): void {
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
    }

    private updateHeaderLabels() {
        this.headerLabelsLayer.updateLabelsText([
            this.style.title,
            this.currentValueText,
        ])
    }

    private buildGridPlotMetrics(): { size: SizeData; position: PositionData } {
        const plotPosition = this.layoutDesign.buildPlotPositionData()
        const gridPosition = this.gridLayer.GridPosData
        const gridSize = this.gridLayer.GridSizeData
        return {
            size: gridSize,
            position: {
                x: plotPosition.x + gridPosition.x,
                y: plotPosition.y + gridPosition.y,
            },
        }
    }

    private relayoutLineMonitor() {
        const gridMetrics = this.buildGridPlotMetrics()
        this.lineMonitorLayer.updateSize(gridMetrics.size)
        this.lineMonitorLayer.updatePosition(gridMetrics.position)
    }

    private updateGridLabels() {
        this.gridLayer.updateLabels('left')
        this.gridLayer.updateLabels('down')
    }

    private relayoutHeaderLabels() {
        const gridMetrics = this.buildGridPlotMetrics()
        const headerY = this.layoutDesign.buildTitleLabelPositionData().y

        this.headerLabelsLayer.updateSize({
            width: gridMetrics.size.width,
            height: this.layoutDesign.headerHeight,
        })
        this.headerLabelsLayer.updatePosition({
            x: gridMetrics.position.x,
            y: headerY,
        })
    }

    private get currentValueText(): string {
        return `${this.pointsData.currentValue.toFixed(2)} ${this.style.unit}`
    }

    private verticalLabelTextAt(normalized: number): string {
        const min = this.pointsData.minValue
        const max = this.pointsData.maxValue
        const value = max - normalized * (max - min)
        return value.toFixed(2)
    }

    private horizontalLabelTextAt(normalized: number): string {
        const seconds = (this.style.windowMs / 1000) * (1 - normalized)
        return formatSecondsAsMinuteSeconds(seconds)
    }

    private updatePointsLineMonitorLayer() {
        const pointsData = this.pointsData
        const mappedPoints = this.pointsData.points.map(point => {
            const normalizedPoint: Point2D = {
                x: point.x,
                y: (point.y - pointsData.minValue) / (pointsData.maxValue - pointsData.minValue)
            }
            return normalizedPoint
        }
        )
        this.lineMonitorLayer.updatePointsData(mappedPoints)
    }
}
