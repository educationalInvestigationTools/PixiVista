import { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'

import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'

export class ComponentBaseLayout extends LayoutDesign {
    constructor(sizeData: SizeData, positionData: PositionData) {
        super(sizeData, positionData)
    }

    get marginVerticalLeft(): number {
        return this.width * 0.05
    }

    get marginVerticalRight(): number {
        return this.width * 0.05
    }

    get xLeft(): number {
        return this.marginVerticalLeft
    }

    get xRight(): number {
        return this.width - this.marginVerticalRight
    }

    get widthAfterMargin(): number {
        return this.xRight - this.xLeft
    }
}

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
