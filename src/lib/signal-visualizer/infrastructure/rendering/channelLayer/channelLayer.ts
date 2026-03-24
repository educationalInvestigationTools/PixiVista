import { OneDimensionalSignalData } from '@/lib/signal-visualizer/infrastructure/rendering/oneDimensionalSignalData.ts'
import { OneDimensionalSignalLayer } from '@/lib/signal-visualizer/infrastructure/rendering/oneDimensionalSignalLayer/oneDimensionalSignalPlotLayer.ts'
import { GridLayer } from '@/lib/signal-visualizer/infrastructure/rendering/gridLayer/gridLayer.ts'

import { RenderLayer } from '@/lib/signal-visualizer/infrastructure/rendering/core/renderLayer.ts'
import type { GridData, PositionData, SizeData } from '@/lib/signal-visualizer/core/types.ts'
import { ChannelLayout } from '@/lib/signal-visualizer/infrastructure/rendering/channelLayer/layout.ts'
import type { LayoutDesign } from '@/lib/signal-visualizer/infrastructure/rendering/core/layoutDesign.ts'
import { GridLayout } from '@/lib/signal-visualizer/infrastructure/rendering/gridLayer/layouts.ts'
import { OneDimensionalSignalLayout } from '@/lib/signal-visualizer/infrastructure/rendering/oneDimensionalSignalLayer/layout.ts'

export class ChannelLayer extends RenderLayer<ChannelLayout> {
    private readonly oneDimensionalSignalLayer: OneDimensionalSignalLayer
    private readonly gridLayer: GridLayer

    constructor(
        channelLayout: ChannelLayout,
        gridData: GridData,
        oneDimensionalSignalData: OneDimensionalSignalData,
    ) {
        super(channelLayout)
        this.gridLayer = new GridLayer(
            new GridLayout(
                {
                    width: channelLayout.width,
                    height: channelLayout.height,
                },
                {
                    x: channelLayout.x,
                    y: channelLayout.y,
                },
                gridData,
            ),
            {
                min: oneDimensionalSignalData.yPart.minMaxValues.min,
                max: oneDimensionalSignalData.yPart.minMaxValues.max,
            },
        )
        this.container.addChild(this.gridLayer.container)

        this.oneDimensionalSignalLayer = new OneDimensionalSignalLayer(
            new OneDimensionalSignalLayout(
                {
                    width: channelLayout.width,
                    height: channelLayout.height,
                },
                {
                    x: channelLayout.x,
                    y: channelLayout.y,
                },
                oneDimensionalSignalData,
            ),
        )
        this.container.addChild(this.oneDimensionalSignalLayer.container)
        console.log('Instantiated')
    }

    get label(): string {
        return this.layoutDesign.label
    }

    get Children(): RenderLayer<LayoutDesign>[] {
        return [this.oneDimensionalSignalLayer, this.gridLayer]
    }

    protected _draw(): void {}

    updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
        this._needsRendering = true
        this.oneDimensionalSignalLayer.updatePosition(positionData)
        this.gridLayer.updatePosition(positionData)
    }

    updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
        this._needsRendering = true
        this.oneDimensionalSignalLayer.updateSize(sizeData)
        this.gridLayer.updateSize(sizeData)
    }
}
