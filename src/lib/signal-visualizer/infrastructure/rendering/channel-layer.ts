import {Container} from "pixi.js";
import {
    OneDimensionalSignalData
} from "@/lib/signal-visualizer/infrastructure/rendering/one-dimensional-signal-data.ts";
import type {GridData} from "@/lib/signal-visualizer/infrastructure/rendering/grid-data.ts";
import type {SizeData} from "@/lib/signal-visualizer/infrastructure/rendering/size-data.ts";
import {
    SignalPlotLayer
} from "@/lib/signal-visualizer/infrastructure/rendering/signal-plot-layer.ts";
import {GridLayer} from "@/lib/signal-visualizer/infrastructure/rendering/grid-layer.ts";


export class ChannelLayer {
    sizeData: SizeData
    private gridData: GridData
    private readonly signalPlotLayer: SignalPlotLayer
    private gridLayer: GridLayer
    container: Container

    constructor(sizeData: SizeData, gridData: GridData, oneDimensionalSignalData: OneDimensionalSignalData) {
        this.container = new Container()
        this.sizeData = sizeData
        this.gridData = gridData
        this.gridLayer = new GridLayer(sizeData, gridData, {
            min: oneDimensionalSignalData.yPart.minMaxValues.min,
            max: oneDimensionalSignalData.yPart.minMaxValues.max
        })
        this.signalPlotLayer = new SignalPlotLayer(sizeData, oneDimensionalSignalData)
        this.container.addChild(this.signalPlotLayer.container)
        this.container.addChild(this.gridLayer.container)
    }

    async updateData(oneDimensionalSignalData: OneDimensionalSignalData) {
        this.signalPlotLayer.signalData = oneDimensionalSignalData
        this.gridLayer.minMaxValues = {
            min: oneDimensionalSignalData.yPart.minMaxValues.min,
            max: oneDimensionalSignalData.yPart.minMaxValues.max
        }
    }

    draw(x: number, y: number) {
        this.gridLayer.draw(x, y)
        this.signalPlotLayer.draw(x, y)
    }
}
