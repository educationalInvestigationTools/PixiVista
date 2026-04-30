import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import type { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import { ChannelLayer } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/channelLayer/channelLayer.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import { ChannelsLayerLayout } from './channelsLayerLayout'
import type { Point2D } from '@/lib/signal-visualizer/core/types/point2D'
export class ChannelsLayer extends RenderLayer<ChannelsLayerLayout> {
    private channels: Map<string, ChannelLayer> = new Map()

    protected _draw(): void { }

    constructor() {
        super(new ChannelsLayerLayout())
    }

    get VisibleChannels(): number {
        return this.channels.size
    }

    get labelsVisibleChannels(): string[] {
        return [... this.channels.keys()]
    }

    get Children(): RenderLayer<LayoutDesign>[] {
        const children = []
        for (const [labelChild, _] of this.channels) {
            const childValue = this.getByLabel(labelChild)!
            children.push(childValue)
        }
        return children
    }

    getByLabel(label: string): ChannelLayer | undefined {
        return this.channels.get(label)
    }

    _updatePosition(positionData: Point2D): void {
        this.layoutDesign.updatePosData(positionData)
        this._updateChannels()
    }

    _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
        this._updateChannels()
    }

    addChannels(labels: string[]) {
        for (const label of labels) {
            const channelLayer = new ChannelLayer(label)
            this.channels.set(label, channelLayer)
            this.container.addChild(channelLayer.container)
        }
        this._updateChannels()
        this._needsRendering = true
    }

    removeChannel(label: string) {
        const deleted = this.channels.delete(label)
        if (deleted) {
            this._updateChannels()
            this._needsRendering = true
        }
    }

    private _updateChannels() {
        const channels = Array.from(this.channels.values())
        channels.map((channel, i) => {
            const sizeData = this.layoutDesign.buildChannelSize(this.VisibleChannels)
            channel.updateSize(sizeData)
            const posData = this.layoutDesign.buildChannelPos(i, this.VisibleChannels)
            channel.updatePosition(posData)
            if (i === channels.length - 1) {
                channel.setDownLabelsEnabled(true)
            }
        })
    }
}
