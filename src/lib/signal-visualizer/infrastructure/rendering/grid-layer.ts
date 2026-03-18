import type { SizeData } from "@/lib/signal-visualizer/infrastructure/rendering/size-data.ts";
import type { GridData } from "@/lib/signal-visualizer/infrastructure/rendering/grid-data.ts";
import { Graphics, Text } from "pixi.js";

import type {
    MinMaxValues
} from "@/lib/signal-visualizer/infrastructure/rendering/min-max-values.ts";
import { Layer } from "./layer";

export class GridLayer extends Layer {
    private gridData: GridData
    minMaxValues: MinMaxValues
    private horizontalLabels: Text[]
    private readonly graphics: Graphics

    constructor(sizeData: SizeData, gridData: GridData, minMaxValues: MinMaxValues) {
        super(sizeData);
        this.graphics = new Graphics()
        this.container.addChild(this.graphics)
        this.gridData = gridData
        this.minMaxValues = minMaxValues
        this.horizontalLabels = []
    }

    customSetSize(): void {

    }

    async draw(x: number, y: number) {
        this.graphics.clear()
        const width = this._sizeData.width
        const height = this._sizeData.height
        const xDivisions = this.gridData.verticalDivisions
        const yDivisions = this.gridData.horizontalDivisions
        this.graphics
            .rect(
                0, 0, width, height
            ).stroke({ width: 1, color: 'black', alpha: 0.1 })

        for (let i = 0; i <= xDivisions; i++) {
            const xDivision = (i / xDivisions) * width
            this.graphics.moveTo(xDivision, height).lineTo(xDivision, 0).stroke({
                color: 'red',
                width: 1,
                alpha: 0.3
            })
        }

        const stepSize = (this.minMaxValues.max - this.minMaxValues.min) / yDivisions

        for (let i = 0; i <= this.horizontalLabels.length; i++) {
            this.container.removeChild(this.horizontalLabels[i]!)
        }
        this.horizontalLabels = []
        for (let i = 0; i <= yDivisions; i++) {
            const yDivision = (i / yDivisions) * height
            this.graphics
                .moveTo(0, yDivision)
                .lineTo(width, yDivision).stroke({ color: 'red', width: 1, alpha: 0.3 })
            const text = new Text(
                {
                    text: (this.minMaxValues.max - i * stepSize).toPrecision(2),
                    style: {
                        fontSize: height * 0.08,
                        fontWeight: 'bold',
                    }
                }
            )
            text.x = -1.3 * text.width
            text.y = yDivision - text.height / 3
            this.container.addChild(text)
            this.horizontalLabels.push(text)
        }
        this.container.position.set(x, y)
    }
}
