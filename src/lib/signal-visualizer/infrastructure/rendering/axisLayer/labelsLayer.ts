import { RenderLayer } from '@/lib/signal-visualizer/infrastructure/rendering/core/renderLayer.ts'
import { LabelsAxisLayerLayout } from '@/lib/signal-visualizer/infrastructure/rendering/axisLayer/layouts.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/positionData.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/sizeData.ts'
import { Text } from 'pixi.js'
import type { MinMaxValues } from '@/lib/signal-visualizer/infrastructure/rendering/minMaxValues.ts'
import type { LayoutDesign } from '../core/layoutDesign'

export class LabelsLayer extends RenderLayer<LabelsAxisLayerLayout> {
    get Children(): RenderLayer<LayoutDesign>[] {
        return []
    }
    updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
        this._needsRendering = true
    }
    updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
        this._needsRendering = true
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
