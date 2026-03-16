import {type Renderer, type RenderModel} from "@/lib/signal-visualizer/core/Renderer.ts";
import {Application} from "pixi.js";
import {Envelope} from "@/lib/signal-visualizer/utils/utils.ts";
import {AxisLayer} from "@/lib/signal-visualizer/infrastructure/axis-layer.ts";
import {ChannelLayer} from "@/lib/signal-visualizer/infrastructure/channel-layer.ts";

export class PixiRenderer implements Renderer {
    private readonly _canvas: HTMLCanvasElement;
    private app: Application;
    private xAxis?: AxisLayer;
    private channelPlots?: ChannelLayer[]
    private started: boolean = false;

    constructor() {
        this._canvas = document.createElement("canvas");
        this._canvas.style.height = "100%";
        this._canvas.style.width = "100%";
        this._canvas.style.display = "block";
        this.app = new Application();
    }

    destroy(): void {
        this.app.destroy()
    }

    get height(): number {
        return this._canvas.clientHeight;
    }

    get width(): number {
        return this._canvas.clientWidth;
    }

    async draw(model: Readonly<RenderModel>): Promise<void> {
        const verticalDivisions = 10
        const horizontalDivisions = 5
        if (!this.started) {
            await this.startPixiApp(model.width, model.height, model.oneDimSignals.channels.length, horizontalDivisions, verticalDivisions);
        }
        const data = model.oneDimSignals
        this.app.renderer.resize(model.width, model.height)
        const xValues = new Envelope(data.samples)
        const totalChannels = model.oneDimSignals.channels.length
        const xAxisHeight = this.height * 0.1
        const plotHeight = (this.height - xAxisHeight) / totalChannels;
        const plotWidth = this.width

        const yValuesPerChannel = data.channels.map(channel => new Envelope(channel))
        const marginHorizontal = plotHeight * 0.05
        const marginVerticalLeft = plotWidth * 0.15
        const marginVerticalRight = plotWidth * 0.05
        const xCord = 0
        const xLeft = xCord + marginVerticalLeft
        const xRight = xCord + this.width - marginVerticalRight
        const widthAfterMargin = (xRight - xLeft)
        for (let i = 0; i < totalChannels; i++) {
            const yCord = i * plotHeight
            const yLow = yCord + marginHorizontal
            const yHigh = yCord + plotHeight - marginHorizontal
            const heightAfterMargin = (yHigh - yLow)

            const channelLayer = this.channelPlots![i]
            channelLayer?.updateData(
                {
                    width: widthAfterMargin,
                    height: heightAfterMargin,
                    horizontalDivisions: horizontalDivisions,
                    verticalDivisions: verticalDivisions,
                    xValues: xValues,
                    yValues: yValuesPerChannel[i]!
                }
            )
            channelLayer?.draw(xLeft, yLow)
        }
        const xAxisY = this.height - xAxisHeight
        this.xAxis?.updateData({
            width: widthAfterMargin,
            height: xAxisHeight,
            minValue: xValues.min,
            maxValue: xValues.max,
            divisions: verticalDivisions,
        })
        this.xAxis?.draw(xLeft, xAxisY)
    }

    private async startPixiApp(width: number, height: number, numberChannels: number, horizontalDivisions: number, verticalDivisions: number): Promise<void> {
        await this.app.init({
            width: width,
            height: height,
            canvas: this._canvas,
            backgroundAlpha: 0.2,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        })
        this.started = true;
        this.xAxis = new AxisLayer({
            width: 0,
            height: 0,
            minValue: 0,
            maxValue: 0,
            divisions: verticalDivisions
        })
        this.app.stage.addChild(this.xAxis.container)
        this.channelPlots = []
        for (let i = 0; i < numberChannels; i++) {
            const channelLayer = new ChannelLayer({
                width: 0,
                height: 0,
                horizontalDivisions: horizontalDivisions,
                verticalDivisions: verticalDivisions,
                xValues: new Envelope(new Float32Array(0)),
                yValues: new Envelope(new Float32Array(0)),
            })
            this.channelPlots.push(channelLayer)
            this.app.stage.addChild(channelLayer.container)
        }
    }

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }
}
