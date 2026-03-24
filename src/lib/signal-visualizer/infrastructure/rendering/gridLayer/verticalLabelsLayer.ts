import { RenderLayer } from '@/lib/signal-visualizer/infrastructure/rendering/core/renderLayer.ts'
import { GridLabelsLayout } from '@/lib/signal-visualizer/infrastructure/rendering/gridLayer/layouts.ts'
import { Text } from 'pixi.js'
import { LayoutDesign } from '@/lib/signal-visualizer/infrastructure/rendering/core/layoutDesign.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/positionData.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/sizeData.ts'
import type { MinMaxValues } from '@/lib/signal-visualizer/infrastructure/rendering/minMaxValues.ts'

export class VerticalLabelsLayer extends RenderLayer<GridLabelsLayout> {
    private horizontalLabels: Text[] = []

    get Children(): RenderLayer<LayoutDesign>[] {
        return []
    }

    protected _draw(): void {
        for (let i = 0; i <= this.horizontalLabels.length; i++) {
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
            text.y = this.layoutDesign.textYPosition(i) - text.height / 3 // !! I think I messed the text.y component.
            this.container.addChild(text)
            this.horizontalLabels.push(text)
        }
    }

    updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
        this._needsRendering = true
    }

    updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
        this._needsRendering = true
    }

    updateMinMaxValues(minMaxValues: MinMaxValues) {
        this.layoutDesign.minMaxValues = minMaxValues
        this._needsRendering = true
    }
}
