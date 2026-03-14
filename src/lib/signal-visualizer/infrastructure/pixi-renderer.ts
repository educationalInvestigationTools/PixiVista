import {type Renderer, type RenderModel} from "@/lib/signal-visualizer/core/Renderer.ts";
import {Application} from "pixi.js";

export class PixiRenderer implements Renderer {
    private readonly _canvas: HTMLCanvasElement;
    private app: Application;
    private started: boolean = false;

    destroy(): void {
        this.app.destroy()
    }

    async draw(model: Readonly<RenderModel>): Promise<void> {
        if (!this.started) {
            await this.startPixiApp(model.width, model.height);
        }
    }

    private async startPixiApp(width: number, height: number): Promise<void> {
        await this.app.init({
            width: width,
            height: height,
            preference: 'webgl',
            canvas: this._canvas,
            backgroundColor : 'rgba(0,93,213,0.6)',
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
