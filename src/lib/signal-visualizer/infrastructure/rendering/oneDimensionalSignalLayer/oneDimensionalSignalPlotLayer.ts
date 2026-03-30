import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import type { OneDimNormalizedSignal, PositionData, SizeData } from '@/lib/signal-visualizer/core/types.ts'
import { type OneDimensionalSignalLayout } from '@/lib/signal-visualizer/infrastructure/rendering/oneDimensionalSignalLayer/layout.ts'
import type { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'

export class OneDimensionalSignalLayer extends RenderLayer<OneDimensionalSignalLayout> {
    get Children(): RenderLayer<LayoutDesign>[] {
        return []
    }

    mapXValue(xValue: number): number {
        return this.layoutDesign.width * xValue
    }

    mapYValue(yValue: number): number {
        return this.layoutDesign.height - this.layoutDesign.height * yValue
    }

    protected _draw(): void {
        const xValues = this.layoutDesign.signalData.xSignal
        const yValues = this.layoutDesign.signalData.ySignal
        const n = yValues.values.length
        for (let i = 0; i < n; i++) {
            if (i > 0) {
                const xMappedCord = this.mapXValue(xValues.values[i]!)
                const yMappedCord = this.mapYValue(yValues.values[i]!)

                const xMappedCordPrev = this.mapXValue(xValues.values[i - 1]!)
                const yMappedCordPrev = this.mapYValue(yValues.values[i - 1]!)
                this.graphics.moveTo(xMappedCordPrev, yMappedCordPrev)
                this.graphics.lineTo(xMappedCord, yMappedCord)
            }
        }
        this.graphics.stroke({ color: 'black', width: 1 })
    }

    updateData(signalData: OneDimNormalizedSignal) {
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
