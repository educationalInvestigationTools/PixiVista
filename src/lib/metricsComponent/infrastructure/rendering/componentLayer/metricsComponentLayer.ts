import type { LayoutDesign } from "@/core/rendering/layoutDesign"
import { RenderLayer } from "@/core/rendering/renderLayer"
import type { Point2D } from "@/core/types/point2D"
import type { SizeData } from "@/core/types/sizeData"
import type { MetricsPoints } from "@/metricsComponent/domain/types/metricsPoints"
import { MetricsChartLayer } from "@/metricsComponent/infrastructure/rendering/chartLayer/metricsChartLayer"
import type { MetricsChartStyle } from "@/metricsComponent/infrastructure/rendering/chartLayer/types/metricsChartStyle"
import { MetricsComponentLayout } from "@/metricsComponent/infrastructure/rendering/componentLayer/metricsComponentLayout"


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
