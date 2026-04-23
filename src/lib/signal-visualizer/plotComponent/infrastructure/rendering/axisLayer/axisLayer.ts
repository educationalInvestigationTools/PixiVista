import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import { LabelsLayer } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/axisLayer/labelsLayer.ts'
import type { LayoutDesign } from '../../../../core/rendering/layoutDesign.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'
import type { MinMaxValues } from '@/lib/signal-visualizer/plotComponent/application/types/minMaxValues.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import { LabelsAxisLayerLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/axisLayer/labelsAxisLayerLayout.ts'
import { AxisLayerLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/axisLayer/axisLayerLayout.ts'

export class AxisLayer extends RenderLayer<AxisLayerLayout> {
    get Children(): RenderLayer<LayoutDesign>[] {
        return [this.labelsLayer]
    }

    private readonly labelsLayer: LabelsLayer

    constructor(axisLayerLayout: AxisLayerLayout, minMaxValues: MinMaxValues) {
        super(axisLayerLayout)
        this.labelsLayer = new LabelsLayer(
            new LabelsAxisLayerLayout(
                this.layoutDesign.labelsLayerSize,
                this.layoutDesign.labelsLayerPosition,
                this.layoutDesign.divisions,
                minMaxValues,
            ),
        )
        this.container.addChild(this.labelsLayer.container)
    }

    _updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
        this.labelsLayer.updatePosition(this.layoutDesign.labelsLayerPosition)
    }

    _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
        this.labelsLayer.updateSize(this.layoutDesign.labelsLayerSize)
    }

    updateMinMaxValues(minMaxValues: MinMaxValues) {
        this.labelsLayer.updateMinMaxValues(minMaxValues)
    }

    _draw(): void {
        const width = this.layoutDesign.width
        const height = this.layoutDesign.height
        const divisions = this.layoutDesign.divisions
        this.graphics
            .rect(0, 0, width, height)
            .fill({ color: '#000000', alpha: 1 })
            .stroke({ width: 1, color: 'white', alpha: 0.2 })
        const yCoordinate = this.layoutDesign.yCoordinate
        for (let i = 0; i <= divisions; i++) {
            const xDivision = this.layoutDesign.xDivision(i)
            this.graphics.circle(xDivision, yCoordinate, this.layoutDesign.circleRadius)
            this.graphics.stroke({ width: 2, color: 'white', alpha: 0.85 })
        }
    }
}
