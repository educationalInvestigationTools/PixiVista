import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import {
    type GridLabelFormatter,
    type HorizontalLabelsSide,
    type VerticalLabelsSide,
} from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/layouts.ts'
import { HorizontalLabelsLayer } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/horizontalLabelsLayer.ts'
import { VerticalLabelsLayer } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/verticalLabelsLayer.ts'
import type { LayoutDesign } from '../../../../core/rendering/layoutDesign.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'
import type { MinMaxValues } from '@/lib/signal-visualizer/plotComponent/application/types/minMaxValues.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import { GridLabelsLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/gridLabelsLayout.ts'
import { HorizontalGridLabelsLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/horizontalGridLabelsLayout.ts'
import { GridLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/gridLayout.ts'

type LabelsDirectionConfig<TSide> =
    | {
          include: false
      }
    | {
          include: true
          side: TSide
          formatter: GridLabelFormatter
      }

export type GridLabelsConfig = {
    vertical: LabelsDirectionConfig<VerticalLabelsSide>
    horizontal: LabelsDirectionConfig<HorizontalLabelsSide>
}

export type GridLabelsMinMaxValues = {
    vertical: MinMaxValues
    horizontal: MinMaxValues
}

export class GridLayer extends RenderLayer<GridLayout> {
    private verticalLabelsLayer?: VerticalLabelsLayer
    private horizontalLabelsLayer?: HorizontalLabelsLayer

    get Children(): RenderLayer<LayoutDesign>[] {
        const children: RenderLayer<LayoutDesign>[] = []
        if (this.verticalLabelsLayer !== undefined) {
            children.push(this.verticalLabelsLayer)
        }
        if (this.horizontalLabelsLayer !== undefined) {
            children.push(this.horizontalLabelsLayer)
        }
        return children
    }

    _updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
    }

    _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
        this.verticalLabelsLayer?.updateSize(sizeData)
        this.horizontalLabelsLayer?.updateSize(sizeData)
    }

    constructor(
        gridLayout: GridLayout,
        minMaxValues: GridLabelsMinMaxValues,
        labelsConfig: GridLabelsConfig,
    ) {
        super(gridLayout)

        if (labelsConfig.vertical.include) {
            this.verticalLabelsLayer = new VerticalLabelsLayer(
                new GridLabelsLayout(
                    this.layoutDesign.buildVerticalGridLabelsSize(),
                    this.layoutDesign.buildVerticalGridLabelsPos(),
                    {
                        horizontalDivisions: gridLayout.horizontalDivisions,
                        verticalDivisions: gridLayout.verticalDivisions,
                    },
                    {
                        minMaxValues: minMaxValues.vertical,
                        side: labelsConfig.vertical.side,
                        formatter: labelsConfig.vertical.formatter,
                    },
                ),
            )
            this.container.addChild(this.verticalLabelsLayer.container)
        }

        if (labelsConfig.horizontal.include) {
            this.horizontalLabelsLayer = new HorizontalLabelsLayer(
                new HorizontalGridLabelsLayout(
                    this.layoutDesign.buildHorizontalGridLabelsSize(),
                    this.layoutDesign.buildHorizontalGridLabelsPos(),
                    {
                        horizontalDivisions: gridLayout.horizontalDivisions,
                        verticalDivisions: gridLayout.verticalDivisions,
                    },
                    {
                        minMaxValues: minMaxValues.horizontal,
                        side: labelsConfig.horizontal.side,
                        formatter: labelsConfig.horizontal.formatter,
                    },
                ),
            )
            this.container.addChild(this.horizontalLabelsLayer.container)
        }
    }

    updateMinMaxValues(minMaxValues: Partial<GridLabelsMinMaxValues>) {
        if (minMaxValues.vertical !== undefined) {
            this.verticalLabelsLayer?.updateMinMaxValues(minMaxValues.vertical)
        }
        if (minMaxValues.horizontal !== undefined) {
            this.horizontalLabelsLayer?.updateMinMaxValues(minMaxValues.horizontal)
        }
    }

    protected _draw() {
        const width = this.layoutDesign.width
        const height = this.layoutDesign.height
        const xDivisions = this.layoutDesign.verticalDivisions
        const yDivisions = this.layoutDesign.horizontalDivisions
        this.graphics.rect(0, 0, width, height).stroke({ width: 1, color: 'white', alpha: 0.2 })

        for (let i = 0; i <= xDivisions; i++) {
            const xDivision = (i / xDivisions) * width
            this.graphics.moveTo(xDivision, height).lineTo(xDivision, 0).stroke({
                color: 'white',
                width: 1,
                alpha: 0.15,
            })
        }

        for (let i = 0; i <= yDivisions; i++) {
            const yDivision = (i / yDivisions) * height
            this.graphics
                .moveTo(0, yDivision)
                .lineTo(width, yDivision)
                .stroke({ color: 'white', width: 1, alpha: 0.15 })
        }
    }
}
