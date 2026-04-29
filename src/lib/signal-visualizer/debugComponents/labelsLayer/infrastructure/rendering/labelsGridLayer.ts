import { LayoutDesign } from '../../../../core/rendering/layoutDesign.ts'
import { RenderLayer } from '../../../../core/rendering/renderLayer.ts'
import type { PositionData } from '../../../../core/types/positionData.ts'
import type { SizeData } from '../../../../core/types/sizeData.ts'
import { LabelLayer } from '@/lib/signal-visualizer/infrastructure/rendering/labelsLayer/labelLayer.ts'
import { generateRandomString } from '../../utils/utils.ts'
import { LabelsGridLayout } from '@/lib/signal-visualizer/debugComponents/labelsLayer/infrastructure/rendering/labelsGridLayout.ts'
import type { GridDescription } from '@/lib/signal-visualizer/debugComponents/labelsLayer/domain/types/gridDescription.ts'

export class LabelsGridLayer extends RenderLayer<LabelsGridLayout> {
    labels: LabelLayer[][] = []

    constructor(gridDescription: GridDescription) {
        super(new LabelsGridLayout(gridDescription))
        for (let i = 0; i < gridDescription.columnsPerRow.length; i++) {
            this.labels.push([])
            for (let j = 0; j < gridDescription.columnsPerRow[i]!; j++) {
                const labelLayer = new LabelLayer({
                    text: generateRandomString(1, 100),
                    textAlignment: 'left',
                })
                this.container.addChild(labelLayer.container)
                this.labels[i]!.push(labelLayer)
            }
        }
    }

    protected _draw(): void {
        for (let i = 0; i < this.labels.length; i++) {
            for (let j = 0; j < this.labels[i]!.length; j++) {
                const labelLayer = this.labels[i]![j]!
                const x = labelLayer.layoutDesign.x
                const y = labelLayer.layoutDesign.y
                const width = labelLayer.layoutDesign.width
                const height = labelLayer.layoutDesign.height
                this.graphics.rect(x, y, width, height).stroke({
                    width: 2,
                    color: 'red',
                })
            }
        }
    }

    get GridDescription() {
        return this.layoutDesign.gridDescription
    }

    getRowAndColumn(positionData: PositionData): [number, number] {
        const rows = this.layoutDesign.gridDescription.columnsPerRow.length
        const rowHeight = this.layoutDesign.height / rows
        const row = Math.max(0, Math.min(rows - 1, Math.floor(positionData.y / rowHeight)))
        const columns = this.layoutDesign.gridDescription.columnsPerRow[row]!
        const columnWidth = this.layoutDesign.width / columns
        const column = Math.max(0, Math.min(columns - 1, Math.floor(positionData.x / columnWidth)))
        return [row, column]
    }

    updateLabelText(text: string, row: number, column: number) {
        this.labels[row]?.[column]?.updateText(text)
    }

    get Children(): RenderLayer<LayoutDesign>[] {
        return this.labels.flat()
    }

    protected _updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
        for (let i = 0; i < this.labels.length; i++) {
            for (let j = 0; j < this.labels[i]!.length; j++) {
                const labelLayer = this.labels[i]![j]!
                labelLayer.updatePosition(this.layoutDesign.buildLabelPosition(i, j))
                labelLayer.updateSize(this.layoutDesign.buildLabelSize(i))
            }
        }
    }
    protected _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
        for (let i = 0; i < this.labels.length; i++) {
            for (let j = 0; j < this.labels[i]!.length; j++) {
                const labelLayer = this.labels[i]![j]!
                labelLayer.updateSize(this.layoutDesign.buildLabelSize(i))
                labelLayer.updatePosition(this.layoutDesign.buildLabelPosition(i, j))
            }
        }
    }
}
