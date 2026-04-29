import { ComponentBaseLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/componentLayer/componentBaseLayout.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'

export class ChannelsLayerLayout extends ComponentBaseLayout {

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

    buildChannelPos(i: number, visibleChannels : number): PositionData {
        return {
            x: 0,
            y: this.yChannelLow(i, visibleChannels),
        }
    }
}
