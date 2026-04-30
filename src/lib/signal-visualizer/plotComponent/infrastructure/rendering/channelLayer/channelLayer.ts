import { OneDimensionalSignalLayer } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/oneDimensionalSignalLayer/oneDimensionalSignalPlotLayer.ts'
import { GridLayer } from '@/lib/signal-visualizer/infrastructure/rendering/gridLayer/gridLayer.ts'

import { RenderLayer } from '@/lib/signal-visualizer/core/rendering/renderLayer.ts'
import type { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { OneDimNormalizedSignal } from '@/lib/signal-visualizer/plotComponent/application/types/oneDimNormalizedSignal.ts'
import { ChannelLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/channelLayer/channelLayout.ts'
import type { Point2D } from '@/lib/signal-visualizer/core/types/point2D'

export class ChannelLayer extends RenderLayer<ChannelLayout> {
    private readonly oneDimensionalSignalLayer: OneDimensionalSignalLayer
    private readonly gridLayer: GridLayer
    private signalData: OneDimNormalizedSignal
    private hasDownLabels: boolean = false

    constructor(label: string) {
        super(new ChannelLayout())
        this.signalData = {
            label: label,
            xSignal: {
                values: new Float32Array(0),
                minMaxValues: { min: 0, max: 0 },
            },
            ySignal: {
                values: new Float32Array(0),
                minMaxValues: { min: 0, max: 0 },
            },
        }
        this.gridLayer = new GridLayer()
        this.gridLayer.addLabelSide('left', (arg0: number) => this.verticalLabelTextAt(arg0))
        this.container.addChild(this.gridLayer.container)

        this.oneDimensionalSignalLayer = new OneDimensionalSignalLayer()
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

    _updatePosition(positionData: Point2D): void {
        this.layoutDesign.updatePosData(positionData)
    }

    updateData(signalData: OneDimNormalizedSignal) {
        this.signalData = signalData
        this._needsRendering = true
        this.updateGridLabels()

        const points: Point2D[] = []
        for (let i = 0; i < this.signalData.xSignal.values.length; i++) {
            const point: Point2D = {
                x: this.signalData.xSignal.values[i]!,
                y: this.signalData.ySignal.values[i]!,
            }
            points.push(point)
        }
        this.oneDimensionalSignalLayer.updateData(points)
    }

    setDownLabelsEnabled(enabled: boolean) {
        if (enabled === this.hasDownLabels) {
            return
        }
        this.hasDownLabels = enabled
        if (enabled) {
            this.gridLayer.addLabelSide('down', (arg0: number) => this.horizontalLabelTextAt(arg0))
        } else {
            this.gridLayer.removeLabelSide('down')
        }
        this.gridLayer.updateSize({
            width: this.layoutDesign.width,
            height: this.layoutDesign.height,
        })
        this.relayoutSignalLayer()
        this.updateGridLabels()
    }

    _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
        this.gridLayer.updateSize(sizeData)
        this.relayoutSignalLayer()
    }

    private relayoutSignalLayer() {
        this.oneDimensionalSignalLayer.updateSize(this.gridLayer.GridSizeData)
        this.oneDimensionalSignalLayer.updatePosition(this.gridLayer.GridPosData)
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

    protected _destroy(): void {

    }
}
