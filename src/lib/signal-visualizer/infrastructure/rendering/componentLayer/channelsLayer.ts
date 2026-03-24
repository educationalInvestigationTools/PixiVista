import { RenderLayer } from '@/lib/signal-visualizer/infrastructure/rendering/core/renderLayer.ts'
import { ChannelsLayerLayout } from '@/lib/signal-visualizer/infrastructure/rendering/componentLayer/layout.ts'
import { GridLayer } from '@/lib/signal-visualizer/infrastructure/rendering/gridLayer/gridLayer.ts'
import type { MinMaxValues } from '@/lib/signal-visualizer/infrastructure/rendering/minMaxValues.ts'
import { GridLayout } from '@/lib/signal-visualizer/infrastructure/rendering/gridLayer/layouts.ts'
import type { LayoutDesign } from '@/lib/signal-visualizer/infrastructure/rendering/core/layoutDesign.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/positionData.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/sizeData.ts'

export class ChannelsLayer extends RenderLayer<ChannelsLayerLayout> {
    private channels: Record<string, GridLayer> = {}
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
    addChannel(label: string, minMaxValues: MinMaxValues) {
        this.layoutDesign.visibleChannels += 1
        const gridLayer = new GridLayer(
            new GridLayout(
                this.layoutDesign.buildChannelSize(),
                {
                    x: 0,
                    y: 0,
                },
                {
                    horizontalDivisions: 4,
                    verticalDivisions: 10,
                },
            ),
            minMaxValues,
        )
        this.channels[label] = gridLayer
        this.container.addChild(gridLayer.container)
        this._updateChannels()
        this._needsRendering = true
    }

    removeChannel(label: string) {
        const child = this.channels[label]
        if (child != undefined) {
            this.layoutDesign.visibleChannels -= 1
            this.container.removeChild(child.container)
            const updatedChannels: Record<string, GridLayer> = {}
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
            console.log(posData)
            index += 1
        }
    }
}
