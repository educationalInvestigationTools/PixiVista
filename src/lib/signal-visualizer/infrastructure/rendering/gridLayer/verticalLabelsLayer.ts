import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import { GridLabelsLayout } from '@/lib/signal-visualizer/infrastructure/rendering/gridLayer/layouts.ts'
import { Text } from 'pixi.js'
import { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { MinMaxValues, PositionData, SizeData } from '@/lib/signal-visualizer/core/types.ts'

export class VerticalLabelsLayer extends RenderLayer<GridLabelsLayout> {
    private horizontalLabels: Text[] = []

    get Children(): RenderLayer<LayoutDesign>[] {
        return []
    }

    protected _draw(): void {
        for (let i = 0; i < this.horizontalLabels.length; i++) {
            this.container.removeChild(this.horizontalLabels[i]!)
        }
        this.horizontalLabels = []

        let maxLabelWidthAtBaseFont = 0
        let maxLabelHeightAtBaseFont = 0
        for (let i = 0; i <= this.layoutDesign.horizontalDivisions; i++) {
            const measureText = new Text({
                text: this.layoutDesign.textLabel(i),
                style: {
                    fontSize: this.layoutDesign.fontSize,
                    fontWeight: 'bold',
                    fill: '#d1d5db',
                },
            })
            maxLabelWidthAtBaseFont = Math.max(maxLabelWidthAtBaseFont, measureText.width)
            maxLabelHeightAtBaseFont = Math.max(maxLabelHeightAtBaseFont, measureText.height)
            measureText.destroy()
        }

        const fittedFontSize = this.layoutDesign.fittedFontSize(
            maxLabelWidthAtBaseFont,
            maxLabelHeightAtBaseFont,
        )
        for (let i = 0; i <= this.layoutDesign.horizontalDivisions; i++) {
            const text = new Text({
                text: this.layoutDesign.textLabel(i),
                style: {
                    fontSize: fittedFontSize,
                    fontWeight: 'bold',
                    fill: '#d1d5db',
                },
            })
            text.x = -(this.layoutDesign.labelToGridGap + text.width)
            text.y = this.layoutDesign.textYPosition(i, text.height)
            this.container.addChild(text)
            this.horizontalLabels.push(text)
        }
    }

    _updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
    }

    _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
    }

    updateMinMaxValues(minMaxValues: MinMaxValues) {
        this.layoutDesign.minMaxValues = minMaxValues
        this._needsRendering = true
    }
}
