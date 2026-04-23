import { AxisLayerBaseLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/axisLayer/axisLayerBaseLayout.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'

export class AxisLayerLayout extends AxisLayerBaseLayout {
    private static readonly LABEL_BOTTOM_PADDING = 1

    get circleRadius(): number {
        return this.height * 0.05
    }

    buildDivisionLabelSize(i: number): SizeData {
        const divisionWidth = this.divisionWidth
        if (this.divisions <= 0) {
            return {
                width: Math.max(this.width, 1),
                height: this.divisionLabelHeight,
            }
        }

        const isEdgeDivision = i === 0 || i === this.divisions
        const width = isEdgeDivision ? divisionWidth / 2 : divisionWidth
        return {
            width: Math.max(width, 1),
            height: this.divisionLabelHeight,
        }
    }

    buildDivisionLabelPosition(i: number): PositionData {
        if (this.divisions <= 0) {
            return {
                x: 0,
                y: this.yCoordinate,
            }
        }

        if (i === 0) {
            return {
                x: 0,
                y: this.yCoordinate,
            }
        }

        const x = (i - 0.5) * this.divisionWidth
        return {
            x,
            y: this.yCoordinate,
        }
    }

    private get divisionLabelHeight(): number {
        return Math.max(this.height - this.yCoordinate - AxisLayerLayout.LABEL_BOTTOM_PADDING, 1)
    }

    private get divisionWidth(): number {
        if (this.divisions <= 0) {
            return this.width
        }
        return this.width / this.divisions
    }
}
