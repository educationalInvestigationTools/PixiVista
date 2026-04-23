import { GridBaseLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/gridBaseLayout.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'

export class GridLayout extends GridBaseLayout {
    buildVerticalGridLabelsSize(): SizeData {
        return {
            width: this.width,
            height: this.height,
        }
    }

    buildVerticalGridLabelsPos(): PositionData {
        return {
            x: 0,
            y: 0,
        }
    }

    buildHorizontalGridLabelsSize(): SizeData {
        return {
            width: this.width,
            height: this.height,
        }
    }

    buildHorizontalGridLabelsPos(): PositionData {
        return {
            x: 0,
            y: 0,
        }
    }

    buildGridLabelsSize(): SizeData {
        return this.buildVerticalGridLabelsSize()
    }

    buildGridLabelsPos(): PositionData {
        return this.buildVerticalGridLabelsPos()
    }
}
