import {type Renderer, type RenderModel} from "@/lib/signal-visualizer/core/Renderer.ts";
import {Application, Container} from "pixi.js";

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

        const totalChannels = model.channels.length
        const xAxisHeight = this.height * 0.04
        const plotHeight = (this.height - xAxisHeight) / totalChannels;

        const coordinateSystem = new Container()
        this.app.stage.addChild(coordinateSystem)

        const plots = []
        for (let i = 0; i < totalChannels; i++) {
            const plot = new Container()
            plot.x = 0
            plot.y = i * plotHeight

            coordinateSystem.addChild(plot)
            plots.push({
                container: plot,
                width: this.width,
                height: plotHeight,
            })
        }

        const xAxis = new Container()
        xAxis.x = 0
        xAxis.y = xAxisHeight
        coordinateSystem.addChild(xAxis)
    }

    private async startPixiApp(width: number, height: number): Promise<void> {
        await this.app.init({
            width: width,
            height: height,
            preference: 'webgl',
            canvas: this._canvas,
            backgroundColor: 0xffffff,
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
