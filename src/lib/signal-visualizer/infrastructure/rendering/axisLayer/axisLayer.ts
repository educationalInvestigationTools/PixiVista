import type { MinMaxValues } from '@/lib/signal-visualizer/infrastructure/rendering/minMaxValues.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/sizeData.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/positionData.ts'
import { RenderLayer } from '@/lib/signal-visualizer/infrastructure/rendering/core/renderLayer.ts'
import {
    AxisLayerLayout,
    LabelsAxisLayerLayout,
} from '@/lib/signal-visualizer/infrastructure/rendering/axisLayer/layouts.ts'
import { LabelsLayer } from '@/lib/signal-visualizer/infrastructure/rendering/axisLayer/labelsLayer.ts'
import type { LayoutDesign } from '../core/layoutDesign'

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
    updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
        this._needsRendering = true
        this.labelsLayer.updatePosition(this.layoutDesign.labelsLayerPosition)
    }
    updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
        this._needsRendering = true
        this.labelsLayer.updateSize(this.layoutDesign.labelsLayerSize)
    }
    updateMinMaxValues(minMaxValues: MinMaxValues) {
        this.labelsLayer.updateMinMaxValues(minMaxValues)
    }

    _draw(): void {
        this.graphics.clear()
        const width = this.layoutDesign.width
        const height = this.layoutDesign.height
        const divisions = this.layoutDesign.divisions
        this.graphics.rect(0, 0, width, height).stroke({ width: 2, color: 'red' })
        const yCoordinate = this.layoutDesign.yCoordinate
        for (let i = 0; i <= divisions; i++) {
            const xDivision = this.layoutDesign.xDivision(i)
            this.graphics.circle(xDivision, yCoordinate, this.layoutDesign.circleRadius)
            this.graphics.stroke({ width: 3, color: 'green' })
        }
    }
}
