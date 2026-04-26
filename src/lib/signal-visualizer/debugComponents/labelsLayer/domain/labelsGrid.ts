import { LayoutDesign } from "../../../core/rendering/layoutDesign";
import { RenderLayer } from "../../../core/rendering/renderLayer";
import type { PositionData } from "../../../core/types/positionData";
import type { SizeData } from "../../../core/types/sizeData";
import { LabelLayer } from "../../../plotComponent/infrastructure/rendering/labelsLayer/labelLayer";
import { LabelLayout } from "../../../plotComponent/infrastructure/rendering/labelsLayer/labelLayout";
import { generateRandomString } from "../utils/utils";

export class LabelsGridLayout extends LayoutDesign {
    gridDescription: GridDescription
    constructor(sizeData: SizeData, posData: PositionData, gridDescription: GridDescription) {
        super(sizeData, posData)
        this.gridDescription = gridDescription
    }
    buildLabelSize(row: number): SizeData {
        return {
            height: this.height / this.gridDescription.columnsPerRow.length,
            width: this.width / this.gridDescription.columnsPerRow[row]!
        }
    }

    buildLabelPosition(row: number, column: number): PositionData {
        const sizeData = this.buildLabelSize(row)
        return {
            x: column * sizeData.width,
            y: row * sizeData.height
        }
    }

}

export type GridDescription = {
    columnsPerRow: number[]
}

export class LabelsGrid extends RenderLayer<LabelsGridLayout> {
    labels: LabelLayer[][] = []

    constructor(gridDescription: GridDescription) {
        super(new LabelsGridLayout({ width: 0, height: 0 }, { x: 0, y: 0 }, gridDescription))
        for (let i = 0; i < gridDescription.columnsPerRow.length; i++) {
            this.labels.push([])
            for (let j = 0; j < gridDescription.columnsPerRow[i]!; j++) {
                const labelLayer = new LabelLayer(
                    new LabelLayout(
                        this.layoutDesign.buildLabelSize(i),
                        this.layoutDesign.buildLabelPosition(i, j)
                    ), { text: generateRandomString(1, 100) })
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
                this.graphics.rect(x, y, width, height).stroke(
                    {
                        width: 2,
                        color: 'red'
                    }
                )
            }
        }
    }

    updateLabelText(text: string, positionData: PositionData) {
        const rows = this.layoutDesign.gridDescription.columnsPerRow.length
        if (rows === 0 || this.layoutDesign.width <= 0 || this.layoutDesign.height <= 0) {
            return
        }

        const rowHeight = this.layoutDesign.height / rows
        const row = Math.max(0, Math.min(rows - 1, Math.floor(positionData.y / rowHeight)))

        const columns = this.layoutDesign.gridDescription.columnsPerRow[row] ?? 0
        if (columns <= 0) {
            return
        }

        const columnWidth = this.layoutDesign.width / columns
        const column = Math.max(0, Math.min(columns - 1, Math.floor(positionData.x / columnWidth)))

        this.labels[row]?.[column]?.updateLabelDescription({ text })
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
