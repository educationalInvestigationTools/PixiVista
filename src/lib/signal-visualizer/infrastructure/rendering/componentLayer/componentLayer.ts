import {
    ChannelsLayerLayout,
    type ComponentLayout,
} from '@/lib/signal-visualizer/infrastructure/rendering/componentLayer/layout.ts'
import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import { AxisLayer } from '@/lib/signal-visualizer/infrastructure/rendering/axisLayer/axisLayer.ts'
import type { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import { AxisLayerLayout } from '@/lib/signal-visualizer/infrastructure/rendering/axisLayer/layouts.ts'
import { ChannelsLayer } from '@/lib/signal-visualizer/infrastructure/rendering/componentLayer/channelsLayer.ts'
import type {
    OneDimNormalizedSignal,
    PositionData,
    SizeData,
} from '@/lib/signal-visualizer/core/types.ts'
import type { ViewPort } from '@/lib/signal-visualizer/application/types/viewPort'

export class ComponentLayer extends RenderLayer<ComponentLayout> {
    readonly axisLayer: AxisLayer
    readonly channelsLayer: ChannelsLayer
    viewPort: ViewPort

    get Children(): RenderLayer<LayoutDesign>[] {
        return [this.axisLayer, this.channelsLayer]
    }

    updateSignalsData(signals: OneDimNormalizedSignal[]) {
        for (const signal of signals) {
            const channelLayer = this.channelsLayer.getByLabel(signal.label)
            if (channelLayer !== undefined) {
                channelLayer.updateData(signal)
            }
        }
        this.axisLayer.updateMinMaxValues({
            min: this.viewPort!.startSeconds,
            max: this.viewPort!.startSeconds + this.viewPort!.lengthSeconds,
        })
    }

    updateViewPort(viewPort: ViewPort) {
        this.viewPort = viewPort
    }

    constructor(componentLayout: ComponentLayout, viewPort: ViewPort, divisions: number) {
        super(componentLayout)
        this.viewPort = viewPort
        this.axisLayer = new AxisLayer(
            new AxisLayerLayout(
                this.layoutDesign.buildXAxisSize(),
                this.layoutDesign.buildXAxisPos(),
                divisions,
            ),
            {
                min: viewPort.startSeconds,
                max: viewPort.startSeconds + viewPort.lengthSeconds,
            },
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

    protected _draw(): void {}

    _updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
        this.axisLayer.updatePosition(this.layoutDesign.buildXAxisPos())
        this.channelsLayer.updatePosition(this.layoutDesign.buildChannelsPos())
    }

    _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
        this.axisLayer.updateSize(this.layoutDesign.buildXAxisSize())
        this.channelsLayer.updateSize(this.layoutDesign.buildChannelsSize())
        this.axisLayer.updatePosition(this.layoutDesign.buildXAxisPos())
        this.channelsLayer.updatePosition(this.layoutDesign.buildChannelsPos())
    }
}
