import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import { MetricsChartLayout } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/chartLayer/layout.ts'
import type { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { MetricsChartSnapshot } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/chartLayer/types/metricsChartSnapshot'
import { GridLayer } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/gridLayer.ts'
import { GridLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/layouts.ts'
import {
    LineMonitorLayer,
    LineMonitorLayout,
} from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/chartLayer/lineMonitorLayer.ts'
import { Text } from 'pixi.js'

const GRID_VERTICAL_DIVISIONS = 6
const GRID_HORIZONTAL_DIVISIONS = 4

export class MetricsChartLayer extends RenderLayer<MetricsChartLayout> {
    private snapshot: MetricsChartSnapshot
    private readonly gridLayer: GridLayer
    private readonly lineMonitorLayer: LineMonitorLayer
    private labels: Text[] = []

    constructor(layoutData: MetricsChartLayout, snapshot: MetricsChartSnapshot) {
        super(layoutData)
        this.snapshot = snapshot

        this.gridLayer = new GridLayer(
            new GridLayout(this.layoutDesign.buildPlotSizeData(), this.layoutDesign.buildPlotPositionData(), {
                horizontalDivisions: GRID_HORIZONTAL_DIVISIONS,
                verticalDivisions: GRID_VERTICAL_DIVISIONS,
            }),
            {
                min: snapshot.minValue,
                max: snapshot.maxValue,
            },
        )

        this.lineMonitorLayer = new LineMonitorLayer(
            new LineMonitorLayout(this.layoutDesign.buildPlotSizeData(), this.layoutDesign.buildPlotPositionData()),
            snapshot,
        )

        this.container.addChild(this.gridLayer.container)
        this.container.addChild(this.lineMonitorLayer.container)
    }

    get Children(): RenderLayer<LayoutDesign>[] {
        return [this.gridLayer, this.lineMonitorLayer]
    }

    updateSnapshot(snapshot: MetricsChartSnapshot) {
        this.snapshot = snapshot
        this.gridLayer.updateMinMaxValues({
            min: snapshot.minValue,
            max: snapshot.maxValue,
        })
        this.lineMonitorLayer.updateSnapshot(snapshot)
        this._needsRendering = true
    }

    _updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
        this.gridLayer.updatePosition(this.layoutDesign.buildPlotPositionData())
        this.lineMonitorLayer.updatePosition(this.layoutDesign.buildPlotPositionData())
    }

    _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
        this.gridLayer.updateSize(this.layoutDesign.buildPlotSizeData())
        this.gridLayer.updatePosition(this.layoutDesign.buildPlotPositionData())

        this.lineMonitorLayer.updateSize(this.layoutDesign.buildPlotSizeData())
        this.lineMonitorLayer.updatePosition(this.layoutDesign.buildPlotPositionData())
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


