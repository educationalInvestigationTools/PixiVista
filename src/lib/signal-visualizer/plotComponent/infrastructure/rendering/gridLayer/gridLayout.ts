import { GridBaseLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/gridBaseLayout.ts'
import type { Side } from './gridLayer';
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData';
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData';

type GridLayoutDescription = {
    sides: Map<Side, (arg0: number) => string>
}

export class GridLayout extends GridBaseLayout {
    gridLayoutDescription: GridLayoutDescription
    constructor(gridLayoutDescription: GridLayoutDescription) {
        super({ width: 0, height: 0 }, { x: 0, y: 0 }, { verticalDivisions: 1, horizontalDivisions: 1 })
        this.gridLayoutDescription = gridLayoutDescription
    }

    private existSide(side: Side) {
        return this.gridLayoutDescription.sides.get(side) !== undefined
    }

    buildLabelsPosition(side: Side): PositionData {
        if (side === 'left') {
            const x = 0
            let y = 0
            if (this.existSide('up')) {
                const sizeData = this.buildLabelsSize('up')
                y = sizeData.height
            }
            return { x, y }
        }

        else if (side === 'right') {
            const sizeData = this.buildLabelsSize('right')
            const x = this.width - sizeData.width
            let y = 0
            if (this.existSide('up')) {
                y = this.buildLabelsSize('up').height
            }
            return { x, y }
        }

        else if (side === 'up') {
            const y = 0
            let x = 0
            if (this.existSide('left')) {
                x = this.buildLabelsSize('left').width
            }
            return { x, y }
        }

        else {
            const y = this.height - this.buildLabelsSize('down').height
            let x = 0
            if (this.existSide('left')) {
                x = this.buildLabelsSize('left').width
            }
            return { x, y }
        }
    }

    buildLabelsSize(side: Side): SizeData {
        const existLeft = this.existSide('left')
        const existRight = this.existSide('right')
        const existUp = this.existSide('up')
        const existDown = this.existSide('down')

        const defaultWidth = Math.min(25, this.width * 0.15)
        const defaultHeight = Math.min(25, this.height * 0.15)

        if (side === 'left' || side === 'right') {
            const width = defaultWidth
            let height = this.height
            if (existUp) {
                height -= defaultHeight
            }
            if (existDown) {
                height -= defaultHeight
            }
            return { width, height }
        }
        else {
            const height = defaultHeight
            let width = this.width
            if (existLeft) {
                width -= defaultWidth
            }
            if (existRight) {
                width -= defaultWidth
            }
            return { width, height }
        }
    }

    buildGridPosition(): PositionData {
        const existLeft = this.existSide('left')
        const existUp = this.existSide('up')
        const sizeLeft = this.buildLabelsSize('left')
        const sizeUp = this.buildLabelsSize('up')
        if (!existLeft && !existUp) {
            return { x: 0, y: 0 }
        }
        else if (existLeft && existUp) {
            return { x: sizeLeft.width, y: sizeUp.height }
        }
        else if (existLeft && !existUp) {
            return { x: sizeLeft.width, y: 0 }
        }
        else {
            return { x: 0, y: sizeUp.height }
        }
    }

    buildGridSize(): SizeData {
        let width = this.width
        let height = this.height
        const existLeft = this.existSide('left')
        const existRight = this.existSide('right')
        const existUp = this.existSide('up')
        const existDown = this.existSide('down')

        if (existLeft) {
            width -= this.buildLabelsSize('left').width
        }

        if (existRight) {
            width -= this.buildLabelsSize('right').width
        }

        if (existUp) {
            height -= this.buildLabelsSize('up').height
        }

        if (existDown) {
            height -= this.buildLabelsSize('down').height
        }

        return { width, height }

    }

    updateDivisions() {
        const gridSize = this.buildGridSize()
        const horizontalDivisions = Math.max(2, Math.floor(gridSize.height / 40))
        const verticalDivisions = Math.max(2, Math.floor(gridSize.width / 50))
        this.gridData = {
            horizontalDivisions,
            verticalDivisions
        }
    }
}
