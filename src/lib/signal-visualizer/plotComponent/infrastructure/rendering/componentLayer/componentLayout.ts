import { ComponentBaseLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/componentLayer/componentBaseLayout.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'

export class ComponentLayout extends ComponentBaseLayout {
    get xAxisHeight(): number {
        return this.height * 0.05
    }

    get xAxisY(): number {
        return this.height - this.xAxisHeight
    }

    buildXAxisSize(): SizeData {
        return {
            width: this.widthAfterMargin,
            height: this.xAxisHeight,
        }
    }

    buildXAxisPos(): PositionData {
        return {
            x: this.xLeft,
            y: this.xAxisY,
        }
    }

    buildChannelsSize(): SizeData {
        return {
            width: this.width,
            height: this.height - this.xAxisHeight,
        }
    }

    buildChannelsPos(): PositionData {
        return {
            x: this.xLeft,
            y: 0,
        }
    }
}
