import type { LayoutDesign } from "@/core/rendering/layoutDesign"
import { RenderLayer } from "@/core/rendering/renderLayer"
import { themeManager } from "@/infrastructure/themes/themeManager"
import type { Point2D } from "@/core/types/point2D"
import type { SizeData } from "@/core/types/sizeData"
import { OneDimensionalSignalLayout } from "@/plotComponent/infrastructure/rendering/oneDimensionalSignalLayer/oneDimensionalSignalLayout"


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
        const currentTheme = themeManager.colors
        this.graphics.stroke({ color: currentTheme.textPrimary, width: 1 })
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

    protected _destroy(): void {

    }
}
