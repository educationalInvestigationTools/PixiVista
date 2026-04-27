import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import type { LayoutDesign } from '../../../../core/rendering/layoutDesign.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import { GridLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/gridLayout.ts'
import {
    LabelLayer,
} from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/labelsLayer/labelLayer.ts'
import type { GridLabelFormatter, GridLabelsConfig, GridLabelsMinMaxValues, HorizontalLabelsSide, VerticalLabelsSide } from './types/types.ts'
import type { MinMaxValues } from '../../../application/types/minMaxValues.ts'
import type { TextAlignments } from '../labelsLayer/types/types.ts'

export type VerticalLabelsState = {
    side: VerticalLabelsSide
    formatter: GridLabelFormatter
    minMaxValues: MinMaxValues
    layers: LabelLayer[]
}

export type HorizontalLabelsState = {
    side: HorizontalLabelsSide
    formatter: GridLabelFormatter
    minMaxValues: MinMaxValues
    layers: LabelLayer[]
}

export class GridLayer extends RenderLayer<GridLayout> {
    private readonly verticalLabels?: VerticalLabelsState
    private readonly horizontalLabels?: HorizontalLabelsState

    get Children(): RenderLayer<LayoutDesign>[] {
        const children: RenderLayer<LayoutDesign>[] = []
        if (this.verticalLabels !== undefined) {
            children.push(...this.verticalLabels.layers)
        }
        if (this.horizontalLabels !== undefined) {
            children.push(...this.horizontalLabels.layers)
        }
        return children
    }

    _updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
        this.updateLabelsLayout()
    }

    _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
        this.updateLabelsLayout()
    }

    constructor(
        gridLayout: GridLayout,
        minMaxValues: GridLabelsMinMaxValues,
        labelsConfig: GridLabelsConfig,
    ) {
        super(gridLayout)

        if (labelsConfig.vertical.include) {
            this.verticalLabels = {
                side: labelsConfig.vertical.side,
                formatter: labelsConfig.vertical.formatter,
                minMaxValues: minMaxValues.vertical,
                layers: [],
            }
            this.createVerticalLabelLayers()
        }

        if (labelsConfig.horizontal.include) {
            this.horizontalLabels = {
                side: labelsConfig.horizontal.side,
                formatter: labelsConfig.horizontal.formatter,
                minMaxValues: minMaxValues.horizontal,
                layers: [],
            }
            this.createHorizontalLabelLayers()
        }
    }

    updateMinMaxValues(minMaxValues: Partial<GridLabelsMinMaxValues>) {
        if (minMaxValues.vertical !== undefined && this.verticalLabels !== undefined) {
            this.verticalLabels.minMaxValues = minMaxValues.vertical
            this.updateVerticalLabelDescriptions()
        }
        if (minMaxValues.horizontal !== undefined && this.horizontalLabels !== undefined) {
            this.horizontalLabels.minMaxValues = minMaxValues.horizontal
            this.updateHorizontalLabelDescriptions()
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

    private createVerticalLabelLayers() {
        if (this.verticalLabels === undefined) {
            return
        }

        for (let i = 0; i <= this.layoutDesign.horizontalDivisions; i++) {
            const labelText = this.verticalLabelText(i)
            const labelLayer = new LabelLayer(
                {
                    text: labelText,
                    textAlignment: this.verticalLabelsTextAlignment(),
                },
            )
            this.verticalLabels.layers.push(labelLayer)
            this.container.addChild(labelLayer.container)
        }
    }

    private createHorizontalLabelLayers() {
        if (this.horizontalLabels === undefined) {
            return
        }

        for (let i = 0; i <= this.layoutDesign.verticalDivisions; i++) {
            const labelLayer = new LabelLayer(
                {
                    text: this.horizontalLabelText(i),
                    textAlignment: 'center',
                },
            )
            this.horizontalLabels.layers.push(labelLayer)
            this.container.addChild(labelLayer.container)
        }
    }

    private updateLabelsLayout() {
        if (this.verticalLabels !== undefined) {
            for (let i = 0; i < this.verticalLabels.layers.length; i++) {
                const labelLayer = this.verticalLabels.layers[i]!
                const labelText = this.verticalLabelText(i)
                const labelSize = this.layoutDesign.buildVerticalLabelSize(labelText.length)
                labelLayer.updateSize(labelSize)
                labelLayer.updatePosition(
                    this.layoutDesign.buildVerticalLabelPosition(
                        i,
                        this.verticalLabels.side,
                        labelSize.width,
                    ),
                )
            }
        }

        if (this.horizontalLabels !== undefined) {
            for (let i = 0; i < this.horizontalLabels.layers.length; i++) {
                const labelLayer = this.horizontalLabels.layers[i]!
                labelLayer.updateSize(this.layoutDesign.buildHorizontalLabelSize())
                labelLayer.updatePosition(
                    this.layoutDesign.buildHorizontalLabelPosition(i, this.horizontalLabels.side),
                )
            }
        }
    }

    private updateVerticalLabelDescriptions() {
        if (this.verticalLabels === undefined) {
            return
        }

        for (let i = 0; i < this.verticalLabels.layers.length; i++) {
            this.verticalLabels.layers[i]!.updateText(this.verticalLabelText(i))
        }
        this.updateLabelsLayout()
    }

    private updateHorizontalLabelDescriptions() {
        if (this.horizontalLabels === undefined) {
            return
        }

        for (let i = 0; i < this.horizontalLabels.layers.length; i++) {
            this.horizontalLabels.layers[i]!.updateText(this.horizontalLabelText(i),)
        }
    }

    private verticalLabelsTextAlignment(): TextAlignments {
        if (this.verticalLabels === undefined) {
            return 'center'
        }

        return this.verticalLabels.side === 'left' ? 'right' : 'left'
    }

    private verticalLabelText(i: number): string {
        if (this.verticalLabels === undefined) {
            return ''
        }

        if (this.layoutDesign.horizontalDivisions <= 0) {
            return this.verticalLabels.formatter(this.verticalLabels.minMaxValues.max)
        }

        const stepSize =
            (this.verticalLabels.minMaxValues.max - this.verticalLabels.minMaxValues.min)
            / this.layoutDesign.horizontalDivisions
        const value = this.verticalLabels.minMaxValues.max - i * stepSize
        return this.verticalLabels.formatter(value)
    }

    private horizontalLabelText(i: number): string {
        if (this.horizontalLabels === undefined) {
            return ''
        }

        if (this.layoutDesign.verticalDivisions <= 0) {
            return this.horizontalLabels.formatter(this.horizontalLabels.minMaxValues.max)
        }

        const stepSize =
            (this.horizontalLabels.minMaxValues.max - this.horizontalLabels.minMaxValues.min)
            / this.layoutDesign.verticalDivisions
        const value = this.horizontalLabels.minMaxValues.max - i * stepSize
        return this.horizontalLabels.formatter(value)
    }
}
