import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import type { LayoutDesign } from '../../../../core/rendering/layoutDesign.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'
import type { MinMaxValues } from '@/lib/signal-visualizer/plotComponent/application/types/minMaxValues.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import { AxisLayerLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/axisLayer/axisLayerLayout.ts'
import {
    LabelLayer,
    type LabelDescription,
} from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/labelsLayer/labelLayer.ts'
import { LabelLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/labelsLayer/labelLayout.ts'

export class AxisLayer extends RenderLayer<AxisLayerLayout> {
    get Children(): RenderLayer<LayoutDesign>[] {
        return this.labelLayers
    }

    private readonly labelLayers: LabelLayer[] = []
    private minMaxValues: MinMaxValues

    constructor(axisLayerLayout: AxisLayerLayout, minMaxValues: MinMaxValues) {
        super(axisLayerLayout)
        this.minMaxValues = minMaxValues
        this.createDivisionLabelLayers()
    }

    _updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
        for (let i = 0; i < this.labelLayers.length; i++) {
            this.labelLayers[i]?.updatePosition(this.layoutDesign.buildDivisionLabelPosition(i))
        }
    }

    _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
        for (let i = 0; i < this.labelLayers.length; i++) {
            this.labelLayers[i]?.updateSize(this.layoutDesign.buildDivisionLabelSize(i))
            this.labelLayers[i]?.updatePosition(this.layoutDesign.buildDivisionLabelPosition(i))
        }
    }

    updateMinMaxValues(minMaxValues: MinMaxValues) {
        this.minMaxValues = minMaxValues
        for (let i = 0; i < this.labelLayers.length; i++) {
            const labelDescription: LabelDescription = {
                text: this.labelTextAtDivision(i),
            }
            this.labelLayers[i]?.updateLabelDescription(labelDescription)
        }
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

    private createDivisionLabelLayers() {
        const divisions = this.layoutDesign.divisions
        for (let i = 0; i <= divisions; i++) {
            const labelLayer = new LabelLayer(
                new LabelLayout(
                    this.layoutDesign.buildDivisionLabelSize(i),
                    this.layoutDesign.buildDivisionLabelPosition(i),
                ),
                {
                    text: this.labelTextAtDivision(i),
                },
            )
            this.labelLayers.push(labelLayer)
            this.container.addChild(labelLayer.container)
        }
    }

    private labelTextAtDivision(i: number): string {
        if (this.layoutDesign.divisions <= 0) {
            return this.minMaxValues.min.toFixed(2)
        }
        const stepSize =
            (this.minMaxValues.max - this.minMaxValues.min) / this.layoutDesign.divisions
        return (this.minMaxValues.min + i * stepSize).toFixed(2)
    }
}
