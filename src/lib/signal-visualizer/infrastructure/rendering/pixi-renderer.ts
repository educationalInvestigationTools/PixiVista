import {
    OneDimSignals,
    type RenderModel
} from "@/lib/signal-visualizer/core/Renderer.ts";
import {Application} from "pixi.js";
import {AxisLayer} from "@/lib/signal-visualizer/infrastructure/rendering/axis-layer.ts";
import {ChannelLayer} from "@/lib/signal-visualizer/infrastructure/rendering/channel-layer.ts";
import {
    OneDimensionalSignalData
} from "@/lib/signal-visualizer/infrastructure/rendering/one-dimensional-signal-data.ts";

export class PixiRenderer {
    private readonly _canvas: HTMLCanvasElement;
    private app: Application;
    private renderModel?: RenderModel  // source of truth, to render anything, search for it here.
    private xAxis?: AxisLayer;
    private channelPlots?: ChannelLayer[]

    constructor() {
        this._canvas = document.createElement("canvas");
        this._canvas.style.height = "100%";
        this._canvas.style.width = "100%";
        this._canvas.style.display = "block";
        this.app = new Application();
    }

    async init(oneDimSignals: OneDimSignals) {
        this.renderModel = {
            verticalDivisions: 10,
            horizontalDivisions: 5,
            width: this._canvas.clientWidth,
            height: this._canvas.clientHeight,
            oneDimSignals: oneDimSignals
        }
        await this.startPixiApp()
    }

    private async startPixiApp(): Promise<void> {
        const model = this.renderModel!
        await this.app.init({
            width: model.width,
            height: model.height,
            canvas: this._canvas,
            backgroundAlpha: 0.2,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        })
        this.channelPlots = []
        for (let i = 0; i < model.oneDimSignals.channels.length; i++) {
            const channelLayer = new ChannelLayer(
                {
                    width: model.width,
                    height: model.height,
                },
                {
                    horizontalDivisions: model.horizontalDivisions,
                    verticalDivisions: model.verticalDivisions
                }, new OneDimensionalSignalData(
                    model.oneDimSignals.channels[i]!.xSignal,
                    model.oneDimSignals.channels[i]!.ySignal,
                ))
            this.channelPlots.push(channelLayer)
            this.app.stage.addChild(channelLayer.container)
        }
        this.xAxis = new AxisLayer(
            {
                width: model.width,
                height: model.height,
            },
            model.verticalDivisions,
            {
                min: model.oneDimSignals.viewPort.startSeconds,
                max: model.oneDimSignals.viewPort.startSeconds + model.oneDimSignals.viewPort.lengthSeconds
            }
        )
    }

    destroy(): void {
        this.app.destroy()
    }

    get height(): number {
        return this.renderModel!.height;
    }

    get width(): number {
        return this.renderModel!.width;
    }

    private get xAxisHeight(): number {
        return this.height * 0.1
    }

    private get plotHeight(): number {
        return (this.height - this.xAxisHeight) / (this.renderModel!.oneDimSignals.totalSignals);
    }

    private get plotWidth(): number {
        return this.width
    }

    private get marginHorizontal(): number {
        return this.plotHeight * 0.05
    }

    private get marginVerticalLeft(): number {
        return this.plotWidth * 0.15
    }

    private get marginVerticalRight(): number {
        return this.plotWidth * 0.05
    }

    private get xLeft(): number {
        return this.marginVerticalLeft
    }

    private get xRight(): number {
        return this.width - this.marginVerticalRight
    }

    private get widthAfterMargin(): number {
        return this.xRight - this.xLeft
    }

    async setSizes(width: number, height: number) {
        this.renderModel!.width = width
        this.renderModel!.height = height
        this.xAxis!.sizeData = {
            width: this.widthAfterMargin,
            height: this.xAxisHeight
        }

        for (let i = 0; i < this.renderModel?.oneDimSignals.totalSignals!; i++) {
            const yCord = i * this.plotHeight
            const yLow = yCord + this.marginHorizontal
            const yHigh = yCord + this.plotHeight - this.marginHorizontal
            const heightAfterMargin = (yHigh - yLow)
            const channelLayer = this.channelPlots![i]!
            channelLayer.sizeData = {
                width: this.widthAfterMargin,
                height: heightAfterMargin
            }
        }
        this.app.renderer.resize(width, height)
        await this.draw()
    }

    async updateSignalData(oneDimSignals: OneDimSignals) {
        this.renderModel!.oneDimSignals = oneDimSignals
        for (let i = 0; i < this.channelPlots!.length; i++) {
            const signal = oneDimSignals.channels[i]!
            await this.channelPlots![i]!.updateData(
                new OneDimensionalSignalData(
                    signal.xSignal,
                    signal.ySignal
                )
            )
        }
        this.xAxis!.minMaxValues = {
            min: oneDimSignals.viewPort.startSeconds,
            max: oneDimSignals.viewPort.startSeconds + oneDimSignals.viewPort.lengthSeconds
        }
    }

    async draw(): Promise<void> {
        const xAxisY = this.height - this.xAxisHeight
        this.xAxis?.draw(this.xLeft, xAxisY)
        for (let i = 0; i < this.renderModel?.oneDimSignals.totalSignals!; i++) {
            const yCord = i * this.plotHeight
            const yLow = yCord + this.marginHorizontal
            const channelLayer = this.channelPlots![i]!
            channelLayer?.draw(this.xLeft, yLow)
        }
    }

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }
}
