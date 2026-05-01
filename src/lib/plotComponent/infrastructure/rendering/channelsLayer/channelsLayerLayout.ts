import type { Point2D } from "@/core/types/point2D"
import type { SizeData } from "@/core/types/sizeData"
import { PlotComponentBaseLayout } from "@/plotComponent/infrastructure/rendering/plotComponentLayer/plotComponentBaseLayout"

export class ChannelsLayerLayout extends PlotComponentBaseLayout  {

    private channelHeight(visibleChannels : number): number {
        if (visibleChannels === 0) {
            return 0
        }
        return this.height / visibleChannels
    }
    get channelMarginHorizontal(): number {
        return 0
    }

    yChannelCoordinate(i: number, visibleChannels : number) {
        return i * this.channelHeight(visibleChannels)
    }

    yChannelLow(i: number, visibleChannels : number) {
        return this.yChannelCoordinate(i, visibleChannels) + this.channelMarginHorizontal
    }

    buildChannelSize(visibleChannels: number): SizeData {
        const heightAfterMargin = this.channelHeight(visibleChannels) - 2 * this.channelMarginHorizontal
        return {
            width: this.widthAfterMargin,
            height: heightAfterMargin,
        }
    }

    buildChannelPos(i: number, visibleChannels : number): Point2D {
        return {
            x: 0,
            y: this.yChannelLow(i, visibleChannels),
        }
    }
}
