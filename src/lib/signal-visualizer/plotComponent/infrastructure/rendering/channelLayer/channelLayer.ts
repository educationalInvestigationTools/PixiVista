import { OneDimensionalSignalLayer } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/oneDimensionalSignalLayer/oneDimensionalSignalPlotLayer.ts'
import { GridLayer } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/gridLayer.ts'

import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import { ChannelLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/channelLayer/layout.ts'
import type { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import { GridLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/layouts.ts'
import { OneDimensionalSignalLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/oneDimensionalSignalLayer/layout.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'
import type { GridData } from '@/lib/signal-visualizer/plotComponent/application/types/gridData.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { OneDimNormalizedSignal } from '@/lib/signal-visualizer/plotComponent/application/types/oneDimNormalizedSignal.ts'

export class ChannelLayer extends RenderLayer<ChannelLayout> {
    private readonly oneDimensionalSignalLayer: OneDimensionalSignalLayer
    private readonly gridLayer: GridLayer

    constructor(
        channelLayout: ChannelLayout,
        gridData: GridData,
        oneDimensionalSignalData: OneDimNormalizedSignal,
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

    get Children(): RenderLayer<LayoutDesign>[] {
        return [this.oneDimensionalSignalLayer, this.gridLayer]
    }

    protected _draw(): void {
        this.graphics.rect(0, 0, this.layoutDesign.width, this.layoutDesign.height).fill({
            color: '#000000',
            alpha: 1,
        })
    }

    _updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
    }

    updateData(signalData: OneDimNormalizedSignal) {
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
