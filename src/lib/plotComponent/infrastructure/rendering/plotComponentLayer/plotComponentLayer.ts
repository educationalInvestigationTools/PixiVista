import type { LayoutDesign } from "@/core/rendering/layoutDesign"
import { RenderLayer } from "@/core/rendering/renderLayer"
import type { Point2D } from "@/core/types/point2D"
import type { SizeData } from "@/core/types/sizeData"
import type { OneDimNormalizedSignal } from "@/plotComponent/application/types/oneDimNormalizedSignal"
import { ChannelsLayer } from "@/plotComponent/infrastructure/rendering/channelsLayer/channelsLayer"
import { PlotComponentLayout } from "@/plotComponent/infrastructure/rendering/plotComponentLayer/plotComponentLayout"

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
