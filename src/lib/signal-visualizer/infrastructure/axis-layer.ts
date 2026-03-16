import {Container, Graphics, Text} from "pixi.js";

export type AxisLayerData = {
    width: number
    height: number
    minValue: number
    maxValue: number
    divisions: number
}

export class AxisLayer {
    private data: AxisLayerData;
    container: Container
    private labels: Text[]
    private readonly graphics: Graphics

    constructor(data: AxisLayerData) {
        this.data = data;
        this.container = new Container()
        this.graphics = new Graphics();
        this.container.addChild(this.graphics)
        this.labels = []
    }

    updateData(data: AxisLayerData) {
        this.data = data;
    }

    draw(x: number, y: number) {
        this.graphics.clear()
        const width = this.data.width;
        const height = this.data.height;
        const xMin = this.data.minValue
        const xMax = this.data.maxValue
        const divisions = this.data.divisions

        this.graphics
            .rect(0, 0, width, height)
            .stroke({width: 2, color: 'red'})
        const yCoordinate = height * 0.2
        const stepSize = (xMax - xMin) / divisions
        for (let i = 0; i < this.labels.length; i++) {
            this.container.removeChild(this.labels[i]!)
        }
        this.labels = []
        for (let i = 0; i <= divisions; i++) {
            const xDivision = (i / divisions) * width
            this.graphics.circle(xDivision, yCoordinate, this.data.height * 0.1)
            this.graphics.stroke({width: 1, color: 'green'})

            const textValue = (xMin + i * (stepSize)).toPrecision(2)
            const fontSize = this.data.height * 0.30
            const fontWeight = 'bold'
            const text = new Text({
                text: textValue,
                style: {
                    fontSize: fontSize,
                    fontWeight: fontWeight
                }
            })
            this.labels.push(text)
            this.container.addChild(text)
            text.x = xDivision - text.width / 2
            text.y = yCoordinate
            this.container.position.set(x, y)
        }
    }
}
