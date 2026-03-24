import { OneDimensionalSignalData } from '@/lib/signal-visualizer/infrastructure/rendering/oneDimensionalSignalData.ts'
import type { GridData } from '@/lib/signal-visualizer/core/gridData.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/sizeData.ts'
import { SignalPlotLayer } from '@/lib/signal-visualizer/infrastructure/rendering/OneDimensionalSignalLayer/signalPlotLayer.ts'
import { GridLayer } from '@/lib/signal-visualizer/infrastructure/rendering/gridLayer/gridLayer.ts'

import { RenderLayer } from '@/lib/signal-visualizer/infrastructure/rendering/core/renderLayer.ts'

export class ChannelLayer extends RenderLayer {
    private readonly gridData: GridData
    private readonly signalPlotLayer: SignalPlotLayer
    private gridLayer: GridLayer

    constructor(
        sizeData: SizeData,
        gridData: GridData,
        oneDimensionalSignalData: OneDimensionalSignalData,
    ) {
        super(sizeData)
        this.gridData = gridData
        this.gridLayer = new GridLayer(sizeData, this.gridData, {
            min: oneDimensionalSignalData.yPart.minMaxValues.min,
            max: oneDimensionalSignalData.yPart.minMaxValues.max,
        })
        this.signalPlotLayer = new SignalPlotLayer(sizeData, oneDimensionalSignalData)
        this.container.addChild(this.signalPlotLayer.container)
        this.container.addChild(this.gridLayer.container)
    }

    customSetSize(): void {
        this.signalPlotLayer.setSize(this._sizeData)
        this.gridLayer.setSize(this._sizeData)
    }

    async updateData(oneDimensionalSignalData: OneDimensionalSignalData) {
        this.signalPlotLayer.signalData = oneDimensionalSignalData
        this.gridLayer.minMaxValues = {
            min: oneDimensionalSignalData.yPart.minMaxValues.min,
            max: oneDimensionalSignalData.yPart.minMaxValues.max,
        }
    }

    async draw(x: number, y: number) {
        await this.gridLayer.draw(x, y)
        await this.signalPlotLayer.draw(x, y)
    }
}
