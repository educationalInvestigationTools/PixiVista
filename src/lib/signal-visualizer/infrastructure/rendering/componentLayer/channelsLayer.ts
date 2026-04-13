import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import { ChannelsLayerLayout } from '@/lib/signal-visualizer/infrastructure/rendering/componentLayer/layout.ts'
import type { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { PositionData, SizeData } from '@/lib/signal-visualizer/core/types.ts'
import { ChannelLayer } from '@/lib/signal-visualizer/infrastructure/rendering/channelLayer/channelLayer.ts'
import { ChannelLayout } from '@/lib/signal-visualizer/infrastructure/rendering/channelLayer/layout.ts'

export class ChannelsLayer extends RenderLayer<ChannelsLayerLayout> {
    private channels: Map<string, ChannelLayer> = new Map()

    protected _draw(): void { }

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
            const childValue = this.channels.get(labelChild)!
            children.push(childValue)
        }
        return children
    }

    getByLabel(label: string): ChannelLayer | undefined {
        return this.channels.get(label)
    }

    _updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
        this._updateChannels()
    }

    _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
        this._updateChannels()
    }

    addChannel(label: string) {
        this.layoutDesign.changeVisibleChannels(this.layoutDesign.visibleChannels + 1)
        const channelLayer = new ChannelLayer(
            new ChannelLayout(
                this.layoutDesign.buildChannelSize(),
                this.layoutDesign.buildChannelPos(0),
                label,
            ),
            {
                horizontalDivisions: 4,
                verticalDivisions: 10,
            },
            {
                label: label,
                xSignal: {
                    values: new Float32Array(0),
                    minMaxValues: { min: 0, max: 0 }
                },
                ySignal: {
                    values: new Float32Array(0),
                    minMaxValues: { min: 0, max: 0 }
                }
            },
        )
        this.channels.set(label, channelLayer)
        this.container.addChild(channelLayer.container)
        this._updateChannels()
        this._needsRendering = true
    }

    removeChannel(label: string) {
        const child = this.channels.get(label)
        if (child != undefined) {
            this.layoutDesign.changeVisibleChannels(this.layoutDesign.visibleChannels - 1)
            this.container.removeChild(child.container)
            const updatedChannels: Map<string, ChannelLayer> = new Map()
            for (const labelChild in this.channels) {
                const childValue = this.channels.get(labelChild)!
                if (labelChild != label) {
                    updatedChannels.set(labelChild, childValue)
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
            const child = this.channels.get(label)!
            const sizeData = this.layoutDesign.buildChannelSize()
            child.updateSize(sizeData)
            const posData = this.layoutDesign.buildChannelPos(index)
            child.updatePosition(posData)
            index += 1
        }
    }
}
