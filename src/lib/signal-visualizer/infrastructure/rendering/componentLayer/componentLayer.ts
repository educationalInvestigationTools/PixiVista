import {
    ChannelsLayerLayout,
    type ComponentLayout,
} from '@/lib/signal-visualizer/infrastructure/rendering/componentLayer/layout.ts'
import { RenderLayer } from '@/lib/signal-visualizer/infrastructure/rendering/core/renderLayer.ts'
import { AxisLayer } from '@/lib/signal-visualizer/infrastructure/rendering/axisLayer/axisLayer.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/positionData.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/sizeData.ts'
import type { LayoutDesign } from '@/lib/signal-visualizer/infrastructure/rendering/core/layoutDesign.ts'
import { AxisLayerLayout } from '@/lib/signal-visualizer/infrastructure/rendering/axisLayer/layouts.ts'
import type { MinMaxValues } from '@/lib/signal-visualizer/infrastructure/rendering/minMaxValues.ts'
import { ChannelsLayer } from '@/lib/signal-visualizer/infrastructure/rendering/componentLayer/channelsLayer.ts'

export class ComponentLayer extends RenderLayer<ComponentLayout> {
    readonly axisLayer: AxisLayer
    readonly channelsLayer: ChannelsLayer
    get Children(): RenderLayer<LayoutDesign>[] {
        return [this.axisLayer, this.channelsLayer]
    }

    constructor(componentLayout: ComponentLayout, minMaxValues: MinMaxValues, divisions: number) {
        super(componentLayout)
        this.axisLayer = new AxisLayer(
            new AxisLayerLayout(
                this.layoutDesign.buildXAxisSize(),
                this.layoutDesign.buildXAxisPos(),
                divisions,
            ),
            minMaxValues,
        )
        this.container.addChild(this.axisLayer.container)
        this.channelsLayer = new ChannelsLayer(
            new ChannelsLayerLayout(
                componentLayout.buildChannelsSize(),
                componentLayout.buildChannelsPos(),
            ),
        )
        this.container.addChild(this.channelsLayer.container)
    }

    protected _draw(): void {
        this.graphics.clear()
        this.graphics
            .rect(0, 0, this.layoutDesign.width, this.layoutDesign.height)
            .fill({ width: 1, color: 'red', alpha: 0.3 })
    }
    updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
        this._needsRendering = true
        this.axisLayer.updatePosition(this.layoutDesign.buildXAxisPos())
        this.channelsLayer.updatePosition(this.layoutDesign.buildChannelsPos())
    }

    updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
        this._needsRendering = true
        this.axisLayer.updateSize(this.layoutDesign.buildXAxisSize())
        this.channelsLayer.updateSize(this.layoutDesign.buildChannelsSize())
    }
}
