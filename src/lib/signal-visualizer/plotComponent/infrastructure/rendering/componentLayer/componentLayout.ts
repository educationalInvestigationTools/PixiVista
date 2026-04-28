import { ComponentBaseLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/componentLayer/componentBaseLayout.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'

export class ComponentLayout extends ComponentBaseLayout {
    buildChannelsSize(): SizeData {
        return {
            width: this.width,
            height: this.height,
        }
    }

    buildChannelsPos(): PositionData {
        return {
            x: this.xLeft,
            y: 0,
        }
    }
}
