import {
    type Renderer,
    type RenderModel
} from "@/lib/signal-visualizer/core/Renderer.ts";
import {Application, Container, Graphics, Text} from "pixi.js";
import {Envelope} from "@/lib/signal-visualizer/utils/utils.ts";

export class PixiRenderer implements Renderer {
    private readonly _canvas: HTMLCanvasElement;
    private app: Application;
    private started: boolean = false;

    destroy(): void {
        this.app.destroy()
    }

    get height(): number {
        return this._canvas.height;
    }

    get width(): number {
        return this._canvas.width;
    }

    async draw(model: Readonly<RenderModel>): Promise<void> {
        if (!this.started) {
            await this.startPixiApp(model.width, model.height);
        }

        this._canvas.width = model.width;
        this._canvas.height = model.height;

        const totalChannels = model.oneDimSignals.channels.length
        const xAxisHeight = this.height * 0.1
        const plotHeight = (this.height - xAxisHeight) / totalChannels;
        const plotWidth = this.width
        const data = model.oneDimSignals
        const coordinateSystem = new Container()

        const xValues = new Envelope(data.samples)
        const yValuesPerChannel = data.channels.map(channel => new Envelope(channel))

        const marginHorizontal = plotHeight * 0.05
        const marginVerticalLeft = plotWidth * 0.15
        const marginVerticalRight = plotWidth * 0.05
        const xDivisions = 10
        const yDivisions = 4
        const xCord = 0
        const xLeft = xCord + marginVerticalLeft
        const xRight = xCord + this.width - marginVerticalRight
        const widthAfterMargin = (xRight - xLeft)
        for (let i = 0; i < totalChannels; i++) {
            const yCord = i * plotHeight
            const yLow = yCord + marginHorizontal
            const yHigh = yCord + plotHeight - marginHorizontal
            const heightAfterMargin = (yHigh - yLow)

            const channelRect = new Graphics()
                .rect(xCord, yCord, plotWidth, plotHeight)
                .stroke({width: 2, color: 'orange'})

            coordinateSystem.addChild(channelRect)

            const plot = this.draw1DPlot(widthAfterMargin, heightAfterMargin, xValues, yValuesPerChannel[i]!, xDivisions, yDivisions)
            plot.x = xLeft
            plot.y = yLow
            coordinateSystem.addChild(plot)
        }
        const xAxisY = this.height - xAxisHeight
        const xAxisRect = new Graphics()
            .rect(xCord, xAxisY, plotWidth, xAxisHeight)
            .stroke({width: 2, color: 'orange'})
        const xAxisGraphic = this.drawXAxis(widthAfterMargin, xAxisHeight, xValues.min, xValues.max, 10)
        xAxisGraphic.x = xLeft
        xAxisGraphic.y = xAxisY
        coordinateSystem.addChild(xAxisGraphic, xAxisRect)
        this.app.stage.addChild(coordinateSystem)
    }

    private drawXAxis(width: number, height: number, xMin: number, xMax: number, divisions: number): Graphics {
        const graphics = new Graphics()
            .rect(0, 0, width, height)
            .stroke({width: 2, color: 'red'})

        const yCoordinate = height * 0.2
        const stepSize = (xMax - xMin) / divisions
        for (let i = 0; i <= divisions; i++) {
            const xDivision = (i / divisions) * width
            graphics.circle(xDivision, yCoordinate, 4)
            graphics.stroke({width: 2, color: 'green'})
            const text = new Text(
                {
                    text: (xMin + i * (stepSize)).toPrecision(2),
                    style: {
                        fontSize: height * 0.40,
                        fontWeight: 'bold',
                    }
                }
            )
            text.x = xDivision - text.width / 2
            text.y = yCoordinate

            graphics.addChild(text)
        }

        return graphics
    }

    private draw1DPlot(width: number, height: number, xValues: Envelope, yValues: Envelope, xDivisions: number, yDivisions: number): Graphics {
        const graphics = new Graphics().rect(
            0, 0, width, height
        ).stroke({width: 2, color: 'black'})

        const n = yValues.length
        const xCoords = new Float32Array(n)
        const yCoords = new Float32Array(n)

        for (let i = 0; i <= xDivisions; i++) {
            const xDivision = (i / xDivisions) * width
            graphics.moveTo(xDivision, height).lineTo(xDivision, 0).stroke({color: 'red', width: 1})
        }

        const stepSize = (yValues.max - xValues.min) / yDivisions
        for (let i = 0; i <= yDivisions; i++) {
            const yDivision = (i / yDivisions) * height
            graphics
                .moveTo(0, yDivision)
                .lineTo(width, yDivision).stroke({color: 'red', width: 1})
            const text = new Text(
                {
                    text: (yValues.max - i * stepSize).toPrecision(2),
                    style: {
                        fontSize: height * 0.10,
                        fontWeight: 'bold',
                    }
                }
            )
            text.x = - 1.3 * text.width
            text.y = yDivision - text.height / 3

            graphics.addChild(text)
        }

        for (let i = 0; i < n; i++) {
            const xMappedCord = width * xValues.normalized[i]!
            const yMappedCord = height * yValues.normalized[i]!

            xCoords[i] = xMappedCord
            yCoords[i] = height - yMappedCord

            graphics.circle(xCoords[i]!, yCoords[i]!, width * 0.005).stroke(
                {color: 'green'}
            )
            if (i > 0) {
                graphics.moveTo(xCoords[i - 1]!, yCoords[i - 1]!)
                graphics.lineTo(xCoords[i]!, yCoords[i]!)
                graphics.stroke({color: 'pink', width: 1})
            }
        }
        return graphics
    }

    private async startPixiApp(width: number, height: number): Promise<void> {
        await this.app.init({
            width: width,
            height: height,
            preference: 'webgpu',
            canvas: this._canvas,
            backgroundAlpha: 0,
        })
        this.started = true;
    }

    constructor() {
        this._canvas = document.createElement("canvas");
        this._canvas.style.height = "100%";
        this._canvas.style.width = "100%";
        this._canvas.style.display = "block";
        this.app = new Application();
    }

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }
}
