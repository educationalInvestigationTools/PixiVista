import { ComponentBaseLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/componentLayer/componentBaseLayout.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'

export class ChannelsLayerLayout extends ComponentBaseLayout {
    private _visibleChannels: number = 0

    constructor(sizeData: SizeData, positionData: PositionData) {
        super(sizeData, positionData)
    }

    get channelHeight(): number {
        if (this._visibleChannels === 0) {
            return 0
        }
        return this.height / this._visibleChannels
    }
    get channelMarginHorizontal(): number {
        return 0
    }

    yChannelCoordinate(i: number) {
        return i * this.channelHeight
    }

    yChannelLow(i: number) {
        return this.yChannelCoordinate(i) + this.channelMarginHorizontal
    }

    buildChannelSize(): SizeData {
        const heightAfterMargin = this.channelHeight - 2 * this.channelMarginHorizontal
        return {
            width: this.widthAfterMargin,
            height: heightAfterMargin,
        }
    }

    changeVisibleChannels(newVal: number) {
        this._visibleChannels = newVal
    }

    get visibleChannels() {
        return this._visibleChannels
    }

    buildChannelPos(i: number): PositionData {
        return {
            x: 0,
            y: this.yChannelLow(i),
        }
    }
}
