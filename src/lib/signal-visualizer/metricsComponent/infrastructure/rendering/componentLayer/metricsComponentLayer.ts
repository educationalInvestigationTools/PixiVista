import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import { MetricsChartLayer } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/chartLayer/metricsChartLayer.ts'
import type { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import { MetricsChartLayout } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/chartLayer/metricsChartLayout.ts'
import {
    MetricsComponentLayout
} from "@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/componentLayer/metricsComponentLayout.ts";
import type { PointsData } from '../chartLayer/types/pointsData'
import type { MetricsChartStyle } from '../chartLayer/types/metricsChartSnapshot'

export class MetricsComponentLayer extends RenderLayer<MetricsComponentLayout> {
    private readonly refreshRateChartLayer: MetricsChartLayer
    private readonly renderTimeChartLayer: MetricsChartLayer

    constructor(layoutData: MetricsComponentLayout, refreshRateStyle : MetricsChartStyle, refreshRatePointsData : PointsData, renderTimeStyles : MetricsChartStyle, renderTimePointsData : PointsData) {
        super(layoutData)

        this.refreshRateChartLayer = new MetricsChartLayer(
            new MetricsChartLayout(
                this.layoutDesign.buildRefreshRateChartSize(),
                this.layoutDesign.buildRefreshRateChartPosition(),
            ),
            refreshRateStyle,
            refreshRatePointsData
        )

        this.renderTimeChartLayer = new MetricsChartLayer(
            new MetricsChartLayout(
                this.layoutDesign.buildRenderTimeChartSize(),
                this.layoutDesign.buildRenderTimeChartPosition(),
            ),
            renderTimeStyles,
            renderTimePointsData
        )

        this.container.addChild(this.refreshRateChartLayer.container)
        this.container.addChild(this.renderTimeChartLayer.container)
    }

    get Children(): RenderLayer<LayoutDesign>[] {
        return [this.refreshRateChartLayer, this.renderTimeChartLayer]
    }

    updateCharts(refreshRatePointsData : PointsData, renderTimePointsData : PointsData) {
        this.refreshRateChartLayer.updatePointsData(refreshRatePointsData)
        this.renderTimeChartLayer.updatePointsData(renderTimePointsData)
    }

    protected _draw(): void {
        this.graphics.rect(0, 0, this.layoutDesign.width, this.layoutDesign.height).fill({
            color: '#020617',
            alpha: 1,
        })
    }

    _updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
        this.refreshRateChartLayer.updatePosition(this.layoutDesign.buildRefreshRateChartPosition())
        this.renderTimeChartLayer.updatePosition(this.layoutDesign.buildRenderTimeChartPosition())
    }

    _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)

        this.refreshRateChartLayer.updateSize(this.layoutDesign.buildRefreshRateChartSize())
        this.refreshRateChartLayer.updatePosition(this.layoutDesign.buildRefreshRateChartPosition())

        this.renderTimeChartLayer.updateSize(this.layoutDesign.buildRenderTimeChartSize())
        this.renderTimeChartLayer.updatePosition(this.layoutDesign.buildRenderTimeChartPosition())
    }
}
