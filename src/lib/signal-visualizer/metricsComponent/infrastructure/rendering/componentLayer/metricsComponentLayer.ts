import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import { MetricsChartLayer } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/chartLayer/metricsChartLayer.ts'
import type { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import { MetricsComponentLayout } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/componentLayer/metricsComponentLayout.ts'
import type { MetricsChartStyle } from '../chartLayer/types/metricsChartStyle.ts'
import type { MetricsPoints } from '@/lib/signal-visualizer/metricsComponent/domain/types/metricsPoints.ts'
import type { Point2D } from '@/lib/signal-visualizer/core/types/point2D.ts'

export class MetricsComponentLayer extends RenderLayer<MetricsComponentLayout> {
    private readonly refreshRateChartLayer: MetricsChartLayer
    private readonly renderTimeChartLayer: MetricsChartLayer

    constructor(
        refreshRateStyle: MetricsChartStyle,
        renderTimeStyles: MetricsChartStyle,
    ) {
        super(new MetricsComponentLayout())

        this.refreshRateChartLayer = new MetricsChartLayer(
            refreshRateStyle,
        )

        this.renderTimeChartLayer = new MetricsChartLayer(
            renderTimeStyles,
        )

        this.container.addChild(this.refreshRateChartLayer.container)
        this.container.addChild(this.renderTimeChartLayer.container)
    }

    get Children(): RenderLayer<LayoutDesign>[] {
        return [this.refreshRateChartLayer, this.renderTimeChartLayer]
    }

    updateCharts(metricsPoints: MetricsPoints) {
        this.refreshRateChartLayer.updatePointsData(metricsPoints.refreshRatePointsData)
        this.renderTimeChartLayer.updatePointsData(metricsPoints.renderTimePointsData)
    }

    protected _draw(): void {
        this.graphics.rect(0, 0, this.layoutDesign.width, this.layoutDesign.height).fill({
            color: '#020617',
            alpha: 1,
        })
    }

    _updatePosition(positionData: Point2D): void {
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

    protected _destroy(): void {

    }
}
