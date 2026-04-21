import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import { MetricsComponentLayout } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/componentLayer/layout.ts'
import { MetricsChartLayer } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/chartLayer/metricsChartLayer.ts'
import { MetricsChartLayout } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/chartLayer/layout.ts'
import type { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { MetricsChartsSnapshot } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/chartLayer/types/metricsChartSnapshot'

export class MetricsComponentLayer extends RenderLayer<MetricsComponentLayout> {
    private readonly refreshRateChartLayer: MetricsChartLayer
    private readonly renderTimeChartLayer: MetricsChartLayer

    constructor(layoutData: MetricsComponentLayout, snapshots: MetricsChartsSnapshot) {
        super(layoutData)

        this.refreshRateChartLayer = new MetricsChartLayer(
            new MetricsChartLayout(
                this.layoutDesign.buildRefreshRateChartSize(),
                this.layoutDesign.buildRefreshRateChartPosition(),
            ),
            snapshots.refreshRateChart,
        )

        this.renderTimeChartLayer = new MetricsChartLayer(
            new MetricsChartLayout(
                this.layoutDesign.buildRenderTimeChartSize(),
                this.layoutDesign.buildRenderTimeChartPosition(),
            ),
            snapshots.renderTimeChart,
        )

        this.container.addChild(this.refreshRateChartLayer.container)
        this.container.addChild(this.renderTimeChartLayer.container)
    }

    get Children(): RenderLayer<LayoutDesign>[] {
        return [this.refreshRateChartLayer, this.renderTimeChartLayer]
    }

    updateCharts(snapshots: MetricsChartsSnapshot) {
        this.refreshRateChartLayer.updateSnapshot(snapshots.refreshRateChart)
        this.renderTimeChartLayer.updateSnapshot(snapshots.renderTimeChart)
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
