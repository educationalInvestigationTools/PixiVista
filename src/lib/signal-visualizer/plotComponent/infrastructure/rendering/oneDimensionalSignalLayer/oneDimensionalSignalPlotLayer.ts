import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import type { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import { OneDimensionalSignalLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/oneDimensionalSignalLayer/oneDimensionalSignalLayout.ts'
import type { Point2D } from '@/lib/signal-visualizer/core/types/point2D'

export class OneDimensionalSignalLayer extends RenderLayer<OneDimensionalSignalLayout> {
    normalizedPoints: Point2D[] = []

    constructor() {
        super(new OneDimensionalSignalLayout())
    }

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
        const n = this.normalizedPoints.length
        for (let i = 0; i < n; i++) {
            if (i > 0) {
                const xMappedCord = this.mapXValue(this.normalizedPoints[i]!.x)
                const yMappedCord = this.mapYValue(this.normalizedPoints[i]!.y)

                const xMappedCordPrev = this.mapXValue(this.normalizedPoints[i - 1]!.x)
                const yMappedCordPrev = this.mapYValue(this.normalizedPoints[i - 1]!.y)
                this.graphics.moveTo(xMappedCordPrev, yMappedCordPrev)
                this.graphics.lineTo(xMappedCord, yMappedCord)
            }
        }
        this.graphics.stroke({ color: 'white', width: 1 })
    }

    updateData(normalizedPoints: Point2D[]) {
        this.normalizedPoints = normalizedPoints
        this._needsRendering = true
    }

    _updatePosition(positionData: Point2D): void {
        this.layoutDesign.updatePosData(positionData)
    }

    _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
    }
}
