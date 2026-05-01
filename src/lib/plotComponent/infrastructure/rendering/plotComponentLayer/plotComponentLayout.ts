import type { Point2D } from "@/core/types/point2D"
import type { SizeData } from "@/core/types/sizeData"
import { PlotComponentBaseLayout } from "@/plotComponent/infrastructure/rendering/plotComponentLayer/plotComponentBaseLayout"


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
