import { RenderLayerDomainApi } from "@/core/rendering/layerApi"
import type { MetricsPoints } from "@/metricsComponent/domain/types/metricsPoints"
import { MetricsComponentLayer } from "@/metricsComponent/infrastructure/rendering/componentLayer/metricsComponentLayer"
import type { EventMediator } from "@/utils/eventMediator"

export class MetricsComponentApi extends RenderLayerDomainApi<MetricsComponentLayer> {
    constructor(eventMediator: EventMediator, windowMs: number) {
        const refreshRateStyle = {
            title: 'Refresh Rate',
            unit: 'FPS',
            lineColor: '#34d399',
            fillColor: '#14532d',
            gridColor: '#34d399',
            windowMs
        }

        const renderTimeStyle = {
            title: 'Render Time',
            unit: 'ms',
            lineColor: '#f59e0b',
            fillColor: '#78350f',
            gridColor: '#f59e0b',
            windowMs
        }

        const component = new MetricsComponentLayer(
            refreshRateStyle,
            renderTimeStyle,
        )
        super(component, eventMediator)
    }

    updateCharts(metricsPointsData: MetricsPoints) {
        this.component.updateCharts(metricsPointsData)
    }
    registerEvents(): void {

    }
}
