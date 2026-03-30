import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import { ChannelsLayerLayout } from '@/lib/signal-visualizer/infrastructure/rendering/componentLayer/layout.ts'
import type { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { OneDimNormalizedSignal, PositionData, SizeData } from '@/lib/signal-visualizer/core/types.ts'
import { ChannelLayer } from '@/lib/signal-visualizer/infrastructure/rendering/channelLayer/channelLayer.ts'
import { ChannelLayout } from '@/lib/signal-visualizer/infrastructure/rendering/channelLayer/layout.ts'

export class ChannelsLayer extends RenderLayer<ChannelsLayerLayout> {
    private channels: Record<string, ChannelLayer> = {}

    protected _draw(): void {}

    get activeChannels(): string[] {
        const result = []
        for (const label in this.channels) {
            result.push(label)
        }
        return result
    }

    get Children(): RenderLayer<LayoutDesign>[] {
        const children = []
        for (const labelChild in this.channels) {
            const childValue = this.channels[labelChild]!
            children.push(childValue)
        }
        return children
    }

    getByLabel(label: string): ChannelLayer | undefined {
        return this.channels[label]
    }

    _updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
        this._updateChannels()
    }

    _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
        this._updateChannels()
    }

    addChannel(oneDimensionalSignalData: OneDimNormalizedSignal) {
        const label = oneDimensionalSignalData.label
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
