import {
    type Renderer,
    type RenderModel
} from "@/lib/signal-visualizer/core/Renderer.ts";
import {Application, Container, Graphics} from "pixi.js";
import {normalizeCoords} from "@/lib/signal-visualizer/utils/utils.ts";

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

        const xCordsNormalized = normalizeCoords(data.samples)
        const yValuesNormalized = data.channels.map(channel => normalizeCoords(channel))

        const marginHorizontal = plotHeight * 0.05
        const marginVertical = plotWidth * 0.05

        for (let i = 0; i < totalChannels; i++) {
            const xCord = 0
            const yCord = i * plotHeight

            const xLeft = xCord + marginVertical
            const xRight = xCord + this.width - marginVertical

            const yLow = yCord + marginHorizontal
            const yHigh = yCord + plotHeight - marginHorizontal

            const widthAfterMargin = (xRight - xLeft)
            const heightAfterMargin = (yHigh - yLow)

            const plot = this.draw1DPlot(xLeft, yLow, widthAfterMargin, heightAfterMargin, xCordsNormalized, yValuesNormalized[i]!)
            coordinateSystem.addChild(plot)
        }

        const xAxisGraphic = this.drawXAxis(marginVertical, this.height - xAxisHeight, this.width - 2 * marginVertical, xAxisHeight, xCordsNormalized)
        coordinateSystem.addChild(xAxisGraphic)
        this.app.stage.addChild(coordinateSystem)
    }


    private drawXAxis(xOffset: number, yOffset: number, width: number, height: number, xCoords: Float32Array): Graphics {
        const graphics = new Graphics()
            .rect(xOffset, yOffset, width, height)
            .stroke({width: 4, color: 'red'})

        const n = xCoords.length
        const yCoordinate = yOffset + height / 2
        for(let i = 0; i < n; i++)
        {
            graphics.circle(xOffset + xCoords[i]! * width, yCoordinate, 4)
            graphics.stroke({width: 4, color: 'green'})
        }

        return graphics
    }

    private draw1DPlot(xOffset: number, yOffset: number, width: number, height: number, xValuesNormalized: Float32Array, yValuesNormalized: Float32Array): Graphics {
        const graphics = new Graphics().rect(
            xOffset, yOffset, width, height
        ).stroke({width: 4, color: 'black'})

        const n = yValuesNormalized.length
        const xCoords = new Float32Array(n)
        const yCoords = new Float32Array(n)

        for (let i = 0; i < n; i++) {
            const xMappedCord = width * xValuesNormalized[i]!
            const yMappedCord = height * yValuesNormalized[i]!

            xCoords[i] = xOffset + xMappedCord
            yCoords[i] = yOffset + (height)  - yMappedCord

            graphics.circle(xCoords[i]!, yCoords[i]!, width * 0.01).stroke(
                {color: 'green'}
            )

            if (i > 0) {
                graphics.moveTo(xCoords[i - 1]!, yCoords[i - 1]!)
                graphics.lineTo(xCoords[i]!, yCoords[i]!)
                graphics.stroke({color: 'pink', width: 3})
            }
        }
        return graphics
    }

    private async startPixiApp(width: number, height: number): Promise<void> {
        await this.app.init({
            width: width,
            height: height,
            preference: 'webgl',
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
