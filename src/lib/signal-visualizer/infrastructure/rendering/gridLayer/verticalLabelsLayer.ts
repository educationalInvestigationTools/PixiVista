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
        for (let i = 0; i <= this.layoutDesign.horizontalDivisions; i++) {
            const text = new Text({
                text: this.layoutDesign.textLabel(i),
                style: {
                    fontSize: this.layoutDesign.height * 0.08,
                    fontWeight: 'bold',
                },
            })
            text.x = -1.3 * text.width
            text.y = this.layoutDesign.textYPosition(i) - text.height / 3
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
