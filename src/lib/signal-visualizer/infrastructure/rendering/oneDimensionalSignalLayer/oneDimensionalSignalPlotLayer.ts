import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import type { OneDimSignal, PositionData, SizeData } from '@/lib/signal-visualizer/core/types.ts'
import { type OneDimensionalSignalLayout } from '@/lib/signal-visualizer/infrastructure/rendering/oneDimensionalSignalLayer/layout.ts'
import type { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'

export class OneDimensionalSignalLayer extends RenderLayer<OneDimensionalSignalLayout> {
    get Children(): RenderLayer<LayoutDesign>[] {
        return []
    }

    protected _draw(): void {
        const width = this.layoutDesign.width
        const height = this.layoutDesign.height
        const xValues = this.layoutDesign.signalData.xSignal
        const yValues = this.layoutDesign.signalData.ySignal
        const n = yValues.valuesNormalized.length
        const xCoords = new Float32Array(n)
        const yCoords = new Float32Array(n)
        for (let i = 0; i < n; i++) {
            const xMappedCord = width * xValues.valuesNormalized[i]!
            const yMappedCord = height * yValues.valuesNormalized[i]!

            xCoords[i] = xMappedCord
            yCoords[i] = height - yMappedCord

            this.graphics.circle(xCoords[i]!, yCoords[i]!, width * 0.001).stroke({ color: 'green' })

            if (i > 0) {
                this.graphics.moveTo(xCoords[i - 1]!, yCoords[i - 1]!)
                this.graphics.lineTo(xCoords[i]!, yCoords[i]!)
                this.graphics.stroke({ color: 'black', width: 1 })
            }
        }
    }

    updateData(signalData: OneDimSignal) {
        this.layoutDesign.signalData = signalData
        this._needsRendering = true
    }

    _updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
    }

    _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
    }
}
