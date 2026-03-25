import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import {
    GridLabelsLayout,
    GridLayout,
} from '@/lib/signal-visualizer/infrastructure/rendering/gridLayer/layouts.ts'
import { VerticalLabelsLayer } from '@/lib/signal-visualizer/infrastructure/rendering/gridLayer/verticalLabelsLayer.ts'
import type { LayoutDesign } from '../../../core/rendering/layoutDesign.ts'
import type { MinMaxValues, PositionData, SizeData } from '@/lib/signal-visualizer/core/types.ts'

export class GridLayer extends RenderLayer<GridLayout> {
    verticalLabelsLayer: VerticalLabelsLayer

    get Children(): RenderLayer<LayoutDesign>[] {
        return [this.verticalLabelsLayer]
    }

    _updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
    }

    _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
        this.verticalLabelsLayer.updateSize(sizeData)
    }

    constructor(gridLayout: GridLayout, minMaxValues: MinMaxValues) {
        super(gridLayout)
        this.verticalLabelsLayer = new VerticalLabelsLayer(
            new GridLabelsLayout(
                this.layoutDesign.buildGridLabelsSize(),
                this.layoutDesign.buildGridLabelsPos(),
                {
                    horizontalDivisions: gridLayout.horizontalDivisions,
                    verticalDivisions: gridLayout.verticalDivisions,
                },
                minMaxValues,
            ),
        )
        this.container.addChild(this.verticalLabelsLayer.container)
    }

    updateMinMaxValues(minMaxValues: MinMaxValues) {
        this.verticalLabelsLayer.updateMinMaxValues(minMaxValues)
    }

    protected _draw() {
        const width = this.layoutDesign.width
        const height = this.layoutDesign.height
        const xDivisions = this.layoutDesign.verticalDivisions
        const yDivisions = this.layoutDesign.horizontalDivisions
        this.graphics.rect(0, 0, width, height).stroke({ width: 1, color: 'black', alpha: 0.1 })

        for (let i = 0; i <= xDivisions; i++) {
            const xDivision = (i / xDivisions) * width
            this.graphics.moveTo(xDivision, height).lineTo(xDivision, 0).stroke({
                color: 'red',
                width: 1,
                alpha: 0.3,
            })
        }

        for (let i = 0; i <= yDivisions; i++) {
            const yDivision = (i / yDivisions) * height
            this.graphics
                .moveTo(0, yDivision)
                .lineTo(width, yDivision)
                .stroke({ color: 'red', width: 1, alpha: 0.3 })
        }
    }
}
