import { AxisLayerBaseLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/axisLayer/axisLayerBaseLayout.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'

export class AxisLayerLayout extends AxisLayerBaseLayout {
    get circleRadius(): number {
        return this.height * 0.05
    }

    get labelsLayerSize(): SizeData {
        return { width: this.width, height: this.height }
    }

    get labelsLayerPosition(): PositionData {
        return { x: 0, y: 0 }
    }
}
