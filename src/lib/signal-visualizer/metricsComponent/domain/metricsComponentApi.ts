import { RenderLayerDomainApi } from '@/lib/signal-visualizer/core/rendering/layerApi.ts'
import { MetricsComponentLayer } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/componentLayer/metricsComponentLayer.ts'
import type { EventMediator } from '@/lib/signal-visualizer/utils/eventMediator.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import { MetricsComponentLayout } from '@/lib/signal-visualizer/metricsComponent/infrastructure/rendering/componentLayer/metricsComponentLayout.ts'
import type { MetricsPoints } from '@/lib/signal-visualizer/metricsComponent/domain/types/metricsPoints.ts'

export class MetricsComponentApi extends RenderLayerDomainApi<MetricsComponentLayer> {
    constructor(sizeData: SizeData, eventMediator: EventMediator) {
        const refreshRateStyle = {
            title: 'Refresh Rate',
            unit: 'FPS',
            lineColor: '#34d399',
            fillColor: '#14532d',
            gridColor: '#34d399',
        }

        const renderTimeStyle = {
            title: 'Render Time',
            unit: 'ms',
            lineColor: '#f59e0b',
            fillColor: '#78350f',
            gridColor: '#f59e0b',
        }

        const component = new MetricsComponentLayer(
            new MetricsComponentLayout(sizeData, {
                x: 0,
                y: 0,
            }),
            refreshRateStyle,
            renderTimeStyle,
        )
        super(component, eventMediator)
    }

    updateCharts(metricsPointsData: MetricsPoints) {
        this.component.updateCharts(metricsPointsData)
    }
    registerEvents(): void {}
}
