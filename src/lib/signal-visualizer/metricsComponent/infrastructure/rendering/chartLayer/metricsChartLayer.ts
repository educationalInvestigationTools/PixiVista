import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import { MetricsChartLayout } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/chartLayer/layout.ts'
import type { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { MetricsChartSnapshot } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/chartLayer/types/metricsChartSnapshot'
import { GridLayer } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/gridLayer.ts'
import { LabelLayer } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/labelsLayer/labelLayer.ts'
import { LabelLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/labelsLayer/labelLayout.ts'
import {
    LineMonitorLayer,
    LineMonitorLayout,
} from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/chartLayer/lineMonitorLayer.ts'
import { GridLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/gridLayout.ts'

const GRID_VERTICAL_DIVISIONS = 6
const GRID_HORIZONTAL_DIVISIONS = 4
const METRICS_WINDOW_SECONDS = 60

function formatSecondsAsMinuteSeconds(value: number): string {
    const safeValue = Math.max(0, Math.round(value))
    const minutes = Math.floor(safeValue / 60)
    const seconds = safeValue % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export class MetricsChartLayer extends RenderLayer<MetricsChartLayout> {
    private snapshot: MetricsChartSnapshot
    private readonly gridLayer: GridLayer
    private readonly lineMonitorLayer: LineMonitorLayer
    private readonly titleLabelLayer: LabelLayer
    private readonly valueLabelLayer: LabelLayer

    constructor(layoutData: MetricsChartLayout, snapshot: MetricsChartSnapshot) {
        super(layoutData)
        this.snapshot = snapshot

        this.gridLayer = new GridLayer(
            new GridLayout(
                this.layoutDesign.buildPlotSizeData(),
                this.layoutDesign.buildPlotPositionData(),
                {
                    horizontalDivisions: GRID_HORIZONTAL_DIVISIONS,
                    verticalDivisions: GRID_VERTICAL_DIVISIONS,
                },
            ),
            {
                vertical: {
                    min: snapshot.minValue,
                    max: snapshot.maxValue,
                },
                horizontal: {
                    min: 0,
                    max: METRICS_WINDOW_SECONDS,
                },
            },
            {
                vertical: {
                    include: true,
                    side: 'left',
                    formatter: (value) => value.toFixed(2),
                },
                horizontal: {
                    include: true,
                    side: 'down',
                    formatter: formatSecondsAsMinuteSeconds,
                },
            },
        )

        this.lineMonitorLayer = new LineMonitorLayer(
            new LineMonitorLayout(
                this.layoutDesign.buildPlotSizeData(),
                this.layoutDesign.buildPlotPositionData(),
            ),
            snapshot,
        )

        this.titleLabelLayer = new LabelLayer(
            new LabelLayout(
                this.layoutDesign.buildTitleLabelSizeData(this.currentValueText.length),
                this.layoutDesign.buildTitleLabelPositionData(),
            ),
            {
                text: snapshot.title,
            },
        )

        this.valueLabelLayer = new LabelLayer(
            new LabelLayout(
                this.layoutDesign.buildValueLabelSizeData(this.currentValueText.length),
                this.layoutDesign.buildValueLabelPositionData(this.currentValueText.length),
            ),
            {
                text: this.currentValueText,
            },
        )

        this.container.addChild(this.gridLayer.container)
        this.container.addChild(this.lineMonitorLayer.container)
        this.container.addChild(this.titleLabelLayer.container)
        this.container.addChild(this.valueLabelLayer.container)
    }

    get Children(): RenderLayer<LayoutDesign>[] {
        return [this.gridLayer, this.lineMonitorLayer, this.titleLabelLayer, this.valueLabelLayer]
    }

    updateSnapshot(snapshot: MetricsChartSnapshot) {
        this.snapshot = snapshot
        this.gridLayer.updateMinMaxValues({
            vertical: {
                min: snapshot.minValue,
                max: snapshot.maxValue,
            },
        })
        this.lineMonitorLayer.updateSnapshot(snapshot)
        this.updateLabelDescriptions()
        this.relayoutHeaderLabels()
        this._needsRendering = true
    }

    _updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
        this.gridLayer.updatePosition(this.layoutDesign.buildPlotPositionData())
        this.lineMonitorLayer.updatePosition(this.layoutDesign.buildPlotPositionData())
        this.relayoutHeaderLabels()
    }

    _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
        this.gridLayer.updateSize(this.layoutDesign.buildPlotSizeData())
        this.gridLayer.updatePosition(this.layoutDesign.buildPlotPositionData())

        this.lineMonitorLayer.updateSize(this.layoutDesign.buildPlotSizeData())
        this.lineMonitorLayer.updatePosition(this.layoutDesign.buildPlotPositionData())
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

    private updateLabelDescriptions() {
        this.titleLabelLayer.updateLabelDescription({ text: this.snapshot.title })
        this.valueLabelLayer.updateLabelDescription({ text: this.currentValueText })
    }

    private relayoutHeaderLabels() {
        const currentValueTextLength = this.currentValueText.length

        this.titleLabelLayer.updateSize(this.layoutDesign.buildTitleLabelSizeData(currentValueTextLength))
        this.titleLabelLayer.updatePosition(this.layoutDesign.buildTitleLabelPositionData())

        this.valueLabelLayer.updateSize(this.layoutDesign.buildValueLabelSizeData(currentValueTextLength))
        this.valueLabelLayer.updatePosition(
            this.layoutDesign.buildValueLabelPositionData(currentValueTextLength),
        )
    }

    private get currentValueText(): string {
        return `${this.snapshot.currentValue.toFixed(2)} ${this.snapshot.unit}`
    }
}
