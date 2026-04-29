import { OneDimensionalSignalLayer } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/oneDimensionalSignalLayer/oneDimensionalSignalPlotLayer.ts'
import { GridLayer, type GridLayoutDescription, type Side } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/gridLayer/gridLayer.ts'

import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import type { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { OneDimNormalizedSignal } from '@/lib/signal-visualizer/plotComponent/application/types/oneDimNormalizedSignal.ts'
import { ChannelLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/channelLayer/channelLayout.ts'

export class ChannelLayer extends RenderLayer<ChannelLayout> {
    private readonly oneDimensionalSignalLayer: OneDimensionalSignalLayer
    private readonly gridLayer: GridLayer
    private signalData: OneDimNormalizedSignal
    private hasDownLabels: boolean = false

    constructor(
        oneDimensionalSignalData: OneDimNormalizedSignal,
    ) {
        super(new ChannelLayout({ width: 0, height: 0 }, { x: 0, y: 0 }))
        this.signalData = oneDimensionalSignalData
        const sides: Map<Side, (arg0: number) => string> = new Map()
        sides.set('left', (arg0: number) => this.verticalLabelTextAt(arg0))
        const description: GridLayoutDescription = { sides }
        this.gridLayer = new GridLayer(description)
        this.container.addChild(this.gridLayer.container)

        this.oneDimensionalSignalLayer = new OneDimensionalSignalLayer(
            oneDimensionalSignalData,
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
        this.signalData = signalData
        this._needsRendering = true
        this.updateGridLabels()
        this.oneDimensionalSignalLayer.updateData(signalData)
    }

    setDownLabelsEnabled(enabled: boolean) {
        if (enabled === this.hasDownLabels) {
            return
        }
        this.hasDownLabels = enabled
        const sides = this.gridLayer.layoutDesign.gridLayoutDescription.sides
        if (enabled) {
            sides.set('down', (arg0: number) => this.horizontalLabelTextAt(arg0))
        } else {
            sides.delete('down')
        }
        this.gridLayer.updateSize({ width: this.layoutDesign.width, height: this.layoutDesign.height })
        this.relayoutSignalLayer()
        this.updateGridLabels()
    }

    _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
        this.gridLayer.updateSize(sizeData)
        this.relayoutSignalLayer()
    }

    private buildGridPlotMetrics(): { size: SizeData; position: PositionData } {
        return {
            size: this.gridLayer.GridSizeData,
            position: this.gridLayer.GridPosData,
        }
    }

    private relayoutSignalLayer() {
        const gridMetrics = this.buildGridPlotMetrics()
        this.oneDimensionalSignalLayer.updateSize(gridMetrics.size)
        this.oneDimensionalSignalLayer.updatePosition(gridMetrics.position)
    }

    private updateGridLabels() {
        this.gridLayer.updateLabels('left')
        if (this.hasDownLabels) {
            this.gridLayer.updateLabels('down')
        }
    }

    private verticalLabelTextAt(normalized: number): string {
        const min = this.signalData.ySignal.minMaxValues.min
        const max = this.signalData.ySignal.minMaxValues.max
        const value = max - normalized * (max - min)
        return value.toFixed(2)
    }

    private horizontalLabelTextAt(normalized: number): string {
        const min = this.signalData.xSignal.minMaxValues.min
        const max = this.signalData.xSignal.minMaxValues.max
        const value = min + normalized * (max - min)
        return value.toFixed(2)
    }
}
