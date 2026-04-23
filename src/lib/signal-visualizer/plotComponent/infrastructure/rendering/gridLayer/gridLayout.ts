import { GridBaseLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/gridBaseLayout.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'
import type {
    HorizontalLabelsSide,
    VerticalLabelsSide,
} from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/layouts.ts'
import { LabelLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/labelsLayer/labelLayout.ts'

export class GridLayout extends GridBaseLayout {
    private static readonly EDGE_MARGIN = 2
    private static readonly MIN_VERTICAL_LABEL_WIDTH = 2

    buildVerticalLabelSize(): SizeData {
        const verticalLabelWidthAvailable = Math.max(
            this.width / 18,
            GridLayout.MIN_VERTICAL_LABEL_WIDTH,
        )
        const width = Math.max(verticalLabelWidthAvailable - this.labelToGridGap, 1)

        const labelCount = Math.max(this.horizontalDivisions + 1, 1)
        const height = Math.max((this.height - GridLayout.EDGE_MARGIN * 2) / labelCount, 1)

        return {
            width,
            height,
        }
    }

    buildVerticalLabelPosition(i: number, side: VerticalLabelsSide): PositionData {
        const sizeData = this.buildVerticalLabelSize()
        const x =
            side === 'left'
                ? -(this.labelToGridGap + sizeData.width)
                : this.width + this.labelToGridGap

        const halfLabelHeight = sizeData.height / 2
        const margin = halfLabelHeight + GridLayout.EDGE_MARGIN
        const usableHeight = Math.max(this.height - margin * 2, 0)

        const y =
            this.horizontalDivisions <= 0
                ? this.height / 2 - halfLabelHeight
                : margin + (i / this.horizontalDivisions) * usableHeight - halfLabelHeight

        return {
            x,
            y,
        }
    }

    buildHorizontalLabelSize(): SizeData {
        const labelCount = Math.max(this.verticalDivisions + 1, 1)
        const width = Math.max((this.width - GridLayout.EDGE_MARGIN * 2) / labelCount, 1)

        return {
            width,
            height: Math.max(LabelLayout.BASE_FONT_SIZE, 1),
        }
    }

    buildHorizontalLabelPosition(i: number, side: HorizontalLabelsSide): PositionData {
        const sizeData = this.buildHorizontalLabelSize()

        const halfLabelWidth = sizeData.width / 2
        const margin = halfLabelWidth + GridLayout.EDGE_MARGIN
        const usableWidth = Math.max(this.width - margin * 2, 0)
        const x =
            this.verticalDivisions <= 0
                ? this.width / 2 - halfLabelWidth
                : margin + (i / this.verticalDivisions) * usableWidth - halfLabelWidth

        const y =
            side === 'up'
                ? -(this.labelToGridGap + sizeData.height)
                : this.height + this.labelToGridGap

        return {
            x,
            y,
        }
    }

    private get labelToGridGap(): number {
        return Math.max(2, LabelLayout.BASE_FONT_SIZE * 0.25)
    }
}
