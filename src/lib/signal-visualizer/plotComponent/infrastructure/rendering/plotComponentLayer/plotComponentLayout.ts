
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { Point2D } from '@/lib/signal-visualizer/core/types/point2D'
import { PlotComponentBaseLayout } from './plotComponentBaseLayout'

export class PlotComponentLayout extends PlotComponentBaseLayout {
    buildChannelsSize(): SizeData {
        return {
            width: this.width,
            height: this.height,
        }
    }

    buildChannelsPos(): Point2D {
        return {
            x: this.xLeft,
            y: 0,
        }
    }
}
