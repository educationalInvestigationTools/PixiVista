import { Container, Graphics } from "pixi.js";
import type { SizeData } from "@/lib/signal-visualizer/infrastructure/rendering/size-data.ts";
import type {
    OneDimensionalSignalData
} from "@/lib/signal-visualizer/infrastructure/rendering/one-dimensional-signal-data.ts";

export class SignalPlotLayer {
    private readonly graphics: Graphics
    private sizeData: SizeData
    signalData: OneDimensionalSignalData
    container: Container

    constructor(sizeData: SizeData, signalData: OneDimensionalSignalData) {
        this.graphics = new Graphics()
        this.container = new Container()
        this.container.addChild(this.graphics)
        this.signalData = signalData
        this.sizeData = sizeData
    }

    setSize(sizeData: SizeData) {
        this.sizeData = sizeData
    }

    draw(x: number, y: number) {
        this.graphics.clear()
        const width = this.sizeData.width
        const height = this.sizeData.height
        const xValues = this.signalData.xPart
        const yValues = this.signalData.yPart
        const n = yValues.valuesNormalized.length
        const xCoords = new Float32Array(n)
        const yCoords = new Float32Array(n)
        for (let i = 0; i < n; i++) {
            const xMappedCord = width * xValues.valuesNormalized[i]!
            const yMappedCord = height * yValues.valuesNormalized[i]!

            xCoords[i] = xMappedCord
            yCoords[i] = height - yMappedCord

            this.graphics
                .circle(xCoords[i]!, yCoords[i]!, width * 0.001)
                .stroke({ color: 'green' })

            if (i > 0) {
                this.graphics
                    .moveTo(xCoords[i - 1]!, yCoords[i - 1]!)
                this.graphics
                    .lineTo(xCoords[i]!, yCoords[i]!)
                this.graphics
                    .stroke({ color: 'black', width: 1 })
            }
        }
        this.container.position.set(x, y)
    }
}
