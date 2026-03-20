import { Graphics } from 'pixi.js'
import type { SizeData } from '@/lib/signal-visualizer/core/size-data.ts'
import type { OneDimensionalSignalData } from '@/lib/signal-visualizer/infrastructure/rendering/one-dimensional-signal-data.ts'
import { Layer } from './layer'

export class SignalPlotLayer extends Layer {
    private readonly graphics: Graphics
    signalData: OneDimensionalSignalData

    constructor(sizeData: SizeData, signalData: OneDimensionalSignalData) {
        super(sizeData)
        this.graphics = new Graphics()
        this.container.addChild(this.graphics)
        this.signalData = signalData
    }

    customSetSize(): void {}

    async draw(x: number, y: number) {
        this.graphics.clear()
        const width = this._sizeData.width
        const height = this._sizeData.height
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

            this.graphics.circle(xCoords[i]!, yCoords[i]!, width * 0.001).stroke({ color: 'green' })

            if (i > 0) {
                this.graphics.moveTo(xCoords[i - 1]!, yCoords[i - 1]!)
                this.graphics.lineTo(xCoords[i]!, yCoords[i]!)
                this.graphics.stroke({ color: 'black', width: 1 })
            }
        }
        this.container.position.set(x, y)
    }
}
