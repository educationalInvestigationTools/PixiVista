import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import type { LayoutDesign } from '../../../core/rendering/layoutDesign.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import { GridLayout } from '@/lib/signal-visualizer/infrastructure/rendering/gridLayer/gridLayout.ts'
import { LineLabelsLayer } from '@/lib/signal-visualizer/infrastructure/rendering/lineLabelsLayer/lineLabelsLayer.ts'
import type { LineLayerDescription } from '../lineLabelsLayer/types/lineLayerDescription.ts'
import type { TextAlignments } from '../labelLayer/types/types.ts'
import type { Point2D } from '@/lib/signal-visualizer/core/types/point2D.ts'

export type Side = 'left' | 'right' | 'up' | 'down'

export class GridLayer extends RenderLayer<GridLayout> {
    private lineLabels: Map<Side, LineLabelsLayer> = new Map()

    constructor() {
        const gridLayout = new GridLayout({ sides: new Map() })
        super(gridLayout)
        this.buildLineLabels()
    }

    private buildLineLabels() {
        for (const [_side, child] of this.lineLabels) {
            this.container.removeChild(child.container)
        }
        this.lineLabels = new Map()
        for (const [side, _] of this.layoutDesign.gridLayoutDescription.sides) {
            const divisions =
                side === 'up' || side == 'down'
                    ? this.layoutDesign.verticalDivisions
                    : this.layoutDesign.horizontalDivisions
            const positions = []
            for (let i = 0; i <= divisions; i++) {
                positions.push(i * (1 / divisions))
            }
            const description: LineLayerDescription = {
                positionsNormalized: positions,
                orientation: side === 'up' || side == 'down' ? 'horizontal' : 'vertical',
                alignmentCallback: this.buildAlignmentCallback(side),
            }
            const child = new LineLabelsLayer(description)
            this.lineLabels.set(side, child)
            this.container.addChild(child.container)
            this.updateLabels(side)
        }
    }

    addLabelSide(side: Side, labelGenerator: (arg0: number) => string) {
        this.layoutDesign.gridLayoutDescription.sides.set(side, labelGenerator)
    }

    removeLabelSide(side: Side) {
        this.layoutDesign.gridLayoutDescription.sides.delete(side)
    }

    private buildAlignmentCallback(side: Side): (_arg0: number, _length: number) => TextAlignments {
        if (side === 'left') {
            return (_arg0: number, _length: number) => 'right'
        } else if (side === 'right') {
            return (_arg0: number, _length: number) => 'right'
        } else {
            return (arg0: number, length: number) => {
                if (arg0 === 0) {
                    return 'left'
                } else if (arg0 === length - 1) {
                    return 'right'
                } else {
                    return 'center'
                }
            }
        }
    }

    get GridSizeData(): SizeData {
        return this.layoutDesign.buildGridSize()
    }

    get GridPosData(): Point2D {
        return this.layoutDesign.buildGridPosition()
    }

    get Children(): RenderLayer<LayoutDesign>[] {
        const children = []
        for (const child of this.lineLabels.values()) children.push(child)
        return children
    }

    _updatePosition(positionData: Point2D): void {
        this.layoutDesign.updatePosData(positionData)
        this.syncLabels()
    }

    private syncLabels() {
        for (const [side, child] of this.lineLabels) {
            child.updatePosition(this.layoutDesign.buildLabelsPosition(side))
            child.updateSize(this.layoutDesign.buildLabelsSize(side))
        }
    }

    private updateDivisions() {
        this.layoutDesign.updateDivisions()
        this.buildLineLabels()
    }

    _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
        this.updateDivisions()
        this.syncLabels()
    }

    protected _draw() {
        const gridPosition = this.layoutDesign.buildGridPosition()
        const gridSize = this.layoutDesign.buildGridSize()

        const x0 = gridPosition.x
        const y0 = gridPosition.y
        const width = gridSize.width
        const height = gridSize.height
        const xDivisions = this.layoutDesign.verticalDivisions
        const yDivisions = this.layoutDesign.horizontalDivisions
        this.graphics.rect(x0, y0, width, height).stroke({ width: 1, color: 'white', alpha: 0.2 })

        for (let i = 0; i <= xDivisions; i++) {
            const ratio = xDivisions <= 0 ? 0.5 : i / xDivisions
            const xDivision = x0 + ratio * width
            this.graphics
                .moveTo(xDivision, y0 + height)
                .lineTo(xDivision, y0)
                .stroke({
                    color: 'white',
                    width: 1,
                    alpha: 0.15,
                })
        }

        for (let i = 0; i <= yDivisions; i++) {
            const ratio = yDivisions <= 0 ? 0.5 : i / yDivisions
            const yDivision = y0 + ratio * height
            this.graphics
                .moveTo(x0, yDivision)
                .lineTo(x0 + width, yDivision)
                .stroke({ color: 'white', width: 1, alpha: 0.15 })
        }
    }

    updateLabels(side: Side) {
        const layer = this.lineLabels.get(side)
        if (layer !== undefined) {
            const generator = this.layoutDesign.gridLayoutDescription.sides.get(side)
            if (generator !== undefined) {
                const divisions =
                    side === 'up' || side == 'down'
                        ? this.layoutDesign.verticalDivisions
                        : this.layoutDesign.horizontalDivisions
                const positions = []
                for (let i = 0; i <= divisions; i++) {
                    positions.push(i * (1 / divisions))
                }
                layer.updateLabelsText(positions.map((x) => generator(x)))
            }
        }
    }

    protected _destroy(): void {

    }
}
