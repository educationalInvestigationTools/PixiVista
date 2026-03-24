import { RenderLayer } from '@/lib/signal-visualizer/infrastructure/rendering/core/renderLayer.ts'
import { ChannelsLayerLayout } from '@/lib/signal-visualizer/infrastructure/rendering/componentLayer/layout.ts'
import type { LayoutDesign } from '@/lib/signal-visualizer/infrastructure/rendering/core/layoutDesign.ts'
import type { PositionData, SizeData } from '@/lib/signal-visualizer/core/types.ts'
import { ChannelLayer } from '@/lib/signal-visualizer/infrastructure/rendering/channelLayer/channelLayer.ts'
import { ChannelLayout } from '@/lib/signal-visualizer/infrastructure/rendering/channelLayer/layout.ts'
import type { OneDimensionalSignalData } from '@/lib/signal-visualizer/infrastructure/rendering/oneDimensionalSignalData.ts'

export class ChannelsLayer extends RenderLayer<ChannelsLayerLayout> {
    private channels: Record<string, ChannelLayer> = {}

    protected _draw(): void {}

    get Children(): RenderLayer<LayoutDesign>[] {
        const children = []
        for (const labelChild in this.channels) {
            const childValue = this.channels[labelChild]!
            children.push(childValue)
        }
        return children
    }

    updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
        this._needsRendering = true
        this._updateChannels()
    }

    updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
        this._needsRendering = true
        this._updateChannels()
    }

    addChannel(label: string, oneDimensionalSignalData: OneDimensionalSignalData) {
        this.layoutDesign.changeVisibleChannels(this.layoutDesign.visibleChannels + 1)
        const gridLayer = new ChannelLayer(
            new ChannelLayout(
                this.layoutDesign.buildChannelSize(),
                this.layoutDesign.buildChannelPos(0),
                label,
            ),
            {
                horizontalDivisions: 4,
                verticalDivisions: 10,
            },
            oneDimensionalSignalData,
        )
        this.channels[label] = gridLayer
        this.container.addChild(gridLayer.container)
        this._updateChannels()
        this._needsRendering = true
        console.log('Added a new channel with label ', label)
    }

    removeChannel(label: string) {
        const child = this.channels[label]
        if (child != undefined) {
            this.layoutDesign.changeVisibleChannels(this.layoutDesign.visibleChannels - 1)
            this.container.removeChild(child.container)
            const updatedChannels: Record<string, ChannelLayer> = {}
            for (const labelChild in this.channels) {
                const childValue = this.channels[labelChild]!
                if (labelChild != label) {
                    updatedChannels[labelChild] = childValue
                }
            }
            this.channels = updatedChannels
            this._updateChannels()
            this._needsRendering = true
        }
    }

    private _updateChannels() {
        let index = 0
        for (const label in this.channels) {
            const child = this.channels[label]!
            const sizeData = this.layoutDesign.buildChannelSize()
            child.updateSize(sizeData)
            const posData = this.layoutDesign.buildChannelPos(index)
            child.updatePosition(posData)
            index += 1
        }
    }
}
