import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import type { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { OneDimNormalizedSignal } from '@/lib/signal-visualizer/plotComponent/application/types/oneDimNormalizedSignal.ts'

import { ChannelsLayer } from '../channelsLayer/channelsLayer'
import type { Point2D } from '@/lib/signal-visualizer/core/types/point2D'
import { PlotComponentLayout } from './plotComponentLayout'

export class PlotComponentLayer extends RenderLayer<PlotComponentLayout> {
    readonly channelsLayer: ChannelsLayer

    get Children(): RenderLayer<LayoutDesign>[] {
        return [this.channelsLayer]
    }

    updateSignalsData(signals: OneDimNormalizedSignal[]) {
        for (const signal of signals) {
            const channelLayer = this.channelsLayer.getByLabel(signal.label)
            if (channelLayer !== undefined) {
                channelLayer.updateData(signal)
            }
        }
    }

    constructor(
        labels: string[],
    ) {
        super(new PlotComponentLayout())
        this.channelsLayer = new ChannelsLayer()
        this.channelsLayer.addChannels(labels)
        this.container.addChild(this.channelsLayer.container)
    }

    protected _draw(): void { }

    _updatePosition(positionData: Point2D): void {
        this.layoutDesign.updatePosData(positionData)
        this.channelsLayer.updatePosition(this.layoutDesign.buildChannelsPos())
    }

    _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
        this.channelsLayer.updateSize(this.layoutDesign.buildChannelsSize())
        this.channelsLayer.updatePosition(this.layoutDesign.buildChannelsPos())
    }

    protected _destroy(): void {

    }
}
