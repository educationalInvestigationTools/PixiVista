import { OneDimensionalSignalLayer } from '@/lib/signal-visualizer/infrastructure/rendering/oneDimensionalSignalLayer/oneDimensionalSignalPlotLayer.ts'
import { GridLayer } from '@/lib/signal-visualizer/infrastructure/rendering/gridLayer/gridLayer.ts'

import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import type {
    GridData,
    OneDimSignal,
    PositionData,
    SizeData,
} from '@/lib/signal-visualizer/core/types.ts'
import { ChannelLayout } from '@/lib/signal-visualizer/infrastructure/rendering/channelLayer/layout.ts'
import type { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import { GridLayout } from '@/lib/signal-visualizer/infrastructure/rendering/gridLayer/layouts.ts'
import { OneDimensionalSignalLayout } from '@/lib/signal-visualizer/infrastructure/rendering/oneDimensionalSignalLayer/layout.ts'

export class ChannelLayer extends RenderLayer<ChannelLayout> {
    private readonly oneDimensionalSignalLayer: OneDimensionalSignalLayer
    private readonly gridLayer: GridLayer

    constructor(
        channelLayout: ChannelLayout,
        gridData: GridData,
        oneDimensionalSignalData: OneDimSignal,
    ) {
        super(channelLayout)
        this.gridLayer = new GridLayer(
            new GridLayout(
                {
                    width: channelLayout.width,
                    height: channelLayout.height,
                },
                {
                    x: 0,
                    y: 0,
                },
                gridData,
            ),
            oneDimensionalSignalData.ySignal.minMaxValues,
        )
        this.container.addChild(this.gridLayer.container)

        this.oneDimensionalSignalLayer = new OneDimensionalSignalLayer(
            new OneDimensionalSignalLayout(
                {
                    width: channelLayout.width,
                    height: channelLayout.height,
                },
                {
                    x: 0,
                    y: 0,
                },
                oneDimensionalSignalData,
            ),
        )
        this.container.addChild(this.oneDimensionalSignalLayer.container)
    }

    get label(): string {
        return this.layoutDesign.label
    }

    get Children(): RenderLayer<LayoutDesign>[] {
        return [this.oneDimensionalSignalLayer, this.gridLayer]
    }

    protected _draw(): void {}

    _updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
    }

    updateData(signalData: OneDimSignal) {
        this._needsRendering = true
        this.gridLayer.updateMinMaxValues(signalData.ySignal.minMaxValues)
        this.oneDimensionalSignalLayer.updateData(signalData)
    }

    _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
        this.oneDimensionalSignalLayer.updateSize(sizeData)
        this.gridLayer.updateSize(sizeData)
    }
}
