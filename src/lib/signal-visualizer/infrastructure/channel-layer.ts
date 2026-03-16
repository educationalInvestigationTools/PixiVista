import {Container, Graphics, Text} from "pixi.js";
import type {Envelope} from "@/lib/signal-visualizer/utils/utils.ts";

export type ChannelLayerData = {
    width: number,
    height: number,
    horizontalDivisions: number
    verticalDivisions: number
    xValues: Envelope
    yValues: Envelope
}

export class ChannelLayer {
    private readonly graphics: Graphics;
    private data: ChannelLayerData
    private labels: Text[]
    container: Container

    constructor(data: ChannelLayerData) {
        this.data = data
        this.graphics = new Graphics()
        this.container = new Container()
        this.container.addChild(this.graphics)
        this.labels = []
    }

    updateData(data: ChannelLayerData) {
        this.data = data
    }

    draw(x: number, y: number) {
        this.graphics.clear()
        const width = this.data.width
        const height = this.data.height
        const xDivisions = this.data.verticalDivisions
        const yDivisions = this.data.horizontalDivisions
        const xValues = this.data.xValues
        const yValues = this.data.yValues
        this.graphics
            .rect(
                0, 0, width, height
            ).stroke({width: 1, color: 'black', alpha : 0.1})

        const n = yValues.length
        const xCoords = new Float32Array(n)
        const yCoords = new Float32Array(n)

        for (let i = 0; i <= xDivisions; i++) {
            const xDivision = (i / xDivisions) * width
            this.graphics.moveTo(xDivision, height).lineTo(xDivision, 0).stroke({
                color: 'red',
                width: 1,
                alpha: 0.3
            })
        }

        const stepSize = (yValues.max - yValues.min) / yDivisions

        for (let i = 0; i <= this.labels.length; i++) {
            this.container.removeChild(this.labels[i]!)
        }
        this.labels = []
        for (let i = 0; i <= yDivisions; i++) {
            const yDivision = (i / yDivisions) * height
            this.graphics
                .moveTo(0, yDivision)
                .lineTo(width, yDivision).stroke({color: 'red', width: 1, alpha : 0.3})
            const text = new Text(
                {
                    text: (yValues.max - i * stepSize).toPrecision(2),
                    style: {
                        fontSize: height * 0.10,
                        fontWeight: 'bold',
                    }
                }
            )
            text.x = -1.3 * text.width
            text.y = yDivision - text.height / 3
            this.labels.push(text)
            this.container.addChild(text)
        }

        for (let i = 0; i < n; i++) {
            const xMappedCord = width * xValues.normalized[i]!
            const yMappedCord = height * yValues.normalized[i]!

            xCoords[i] = xMappedCord
            yCoords[i] = height - yMappedCord

            this.graphics.circle(xCoords[i]!, yCoords[i]!, width * 0.001).stroke(
                {color: 'green'}
            )
            if (i > 0) {
                this.graphics.moveTo(xCoords[i - 1]!, yCoords[i - 1]!)
                this.graphics.lineTo(xCoords[i]!, yCoords[i]!)
                this.graphics.stroke({color: 'black', width: 1})
            }
        }
        this.container.position.set(x, y)
    }
}
