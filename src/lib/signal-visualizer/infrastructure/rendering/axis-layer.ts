import { Graphics, Text } from "pixi.js";
import type {
    MinMaxValues
} from "@/lib/signal-visualizer/infrastructure/rendering/min-max-values.ts";
import type { SizeData } from "@/lib/signal-visualizer/infrastructure/rendering/size-data.ts";
import { Layer } from "./layer";

export class AxisLayer extends Layer {
    private readonly divisions: number
    minMaxValues: MinMaxValues
    private verticalLabels: Text[]
    private readonly graphics: Graphics

    constructor(sizeData: SizeData, divisions: number, minMaxValues: MinMaxValues) {
        super(sizeData);
        this.divisions = divisions
        this.minMaxValues = minMaxValues
        this.graphics = new Graphics();
        this.container.addChild(this.graphics)
        this.verticalLabels = []
    }

    customSetSize(): void {

    }

    draw(x: number, y: number) {
        this.graphics.clear()
        const width = this._sizeData.width;
        const height = this._sizeData.height;
        const xMin = this.minMaxValues.min
        const xMax = this.minMaxValues.max
        const divisions = this.divisions

        this.graphics
            .rect(0, 0, width, height)
            .stroke({ width: 1, color: 'red' })
        const yCoordinate = height * 0.2
        const stepSize = (xMax - xMin) / divisions
        for (let i = 0; i < this.verticalLabels.length; i++) {
            this.container.removeChild(this.verticalLabels[i]!)
        }
        this.verticalLabels = []
        for (let i = 0; i <= divisions; i++) {
            const xDivision = (i / divisions) * width
            this.graphics.circle(xDivision, yCoordinate, height * 0.05)
            this.graphics.stroke({ width: 1, color: 'green' })
            const textValue = (xMin + i * (stepSize))
            const fontSize = height * 0.20
            const fontWeight = 'bold'
            const text = new Text({
                text: textValue,
                style: {
                    fontSize: fontSize,
                    fontWeight: fontWeight
                }
            })
            this.verticalLabels.push(text)
            this.container.addChild(text)
            text.x = xDivision - text.width / 2
            text.y = yCoordinate
        }
        this.container.position.set(x, y)
        return Promise.resolve()
    }
}
