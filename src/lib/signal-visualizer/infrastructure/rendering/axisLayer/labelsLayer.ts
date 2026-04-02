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

        let maxLabelHeightAtBaseFont = 0
        for (let i = 0; i <= this.layoutDesign.divisions; i++) {
            const measuredText = new Text({
                text: this.layoutDesign.textValue(i),
                style: {
                    fontSize: this.layoutDesign.fontSize,
                    fontWeight: 'bold',
                    fill: '#e5e7eb',
                },
            })
            maxLabelHeightAtBaseFont = Math.max(maxLabelHeightAtBaseFont, measuredText.height)
            measuredText.destroy()
        }

        const fittedFontSize = this.layoutDesign.fittedFontSize(maxLabelHeightAtBaseFont)
        const divisions = this.layoutDesign.divisions
        const yCoordinate = this.layoutDesign.yCoordinate
        for (let i = 0; i <= divisions; i++) {
            const xDivision = this.layoutDesign.xDivision(i)
            const textValue = this.layoutDesign.textValue(i)
            const fontWeight = 'bold'
            const text = new Text({
                text: textValue,
                style: {
                    fontSize: fittedFontSize,
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
