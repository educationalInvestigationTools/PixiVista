import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import { LabelsAxisLayerLayout } from '@/lib/signal-visualizer/infrastructure/rendering/axisLayer/layouts.ts'
import { Text } from 'pixi.js'
import type { LayoutDesign } from '../../../core/rendering/layoutDesign.ts'
import type { MinMaxValues, PositionData, SizeData } from '@/lib/signal-visualizer/core/types.ts'

export class LabelsLayer extends RenderLayer<LabelsAxisLayerLayout> {
    get Children(): RenderLayer<LayoutDesign>[] {
        return []
    }

    _updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
    }

    _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
    }

    private verticalLabels: Text[]

    _draw(): void {
        for (let i = 0; i < this.verticalLabels.length; i++) {
            this.container.removeChild(this.verticalLabels[i]!)
        }
        this.verticalLabels = []
        const divisions = this.layoutDesign.divisions
        const yCoordinate = this.layoutDesign.yCoordinate
        for (let i = 0; i <= divisions; i++) {
            const xDivision = this.layoutDesign.xDivision(i)
            const textValue = this.layoutDesign.textValue(i)
            const fontSize = this.layoutDesign.fontSize
            const fontWeight = 'bold'
            const text = new Text({
                text: textValue,
                style: {
                    fontSize: fontSize,
                    fontWeight: fontWeight,
                    fill: '#e5e7eb',
                },
            })
            text.x = xDivision - text.width / 2
            text.y = yCoordinate
            this.verticalLabels.push(text)
            this.container.addChild(text)
        }
    }

    constructor(layoutData: LabelsAxisLayerLayout) {
        super(layoutData)
        this.verticalLabels = []
    }

    updateMinMaxValues(minMaxValues: MinMaxValues) {
        this.layoutDesign.minMaxValues = minMaxValues
        this._needsRendering = true
    }
}
