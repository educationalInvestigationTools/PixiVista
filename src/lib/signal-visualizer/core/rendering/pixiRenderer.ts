import { Application } from 'pixi.js'
import type { SizeData } from '../types'

export class PixiRenderer {
    private readonly _canvas: HTMLCanvasElement
    app: Application

    private _resizeId: number | null = null;
    private _pendingSize: SizeData | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas
        this.app = new Application()
    }

    async init() {
        const sizeData = {
            width: this._canvas.clientWidth,
            height: this._canvas.clientHeight,
        }
        await this.app.init({
            width: sizeData.width,
            height: sizeData.height,
            canvas: this._canvas,
            backgroundColor: '#000000',
            backgroundAlpha: 1,
            resolution: window.devicePixelRatio,
            autoDensity: true,
        })
    }

    async resize(sizeData: SizeData) {
        this._pendingSize = sizeData;

        if (this._resizeId !== null) {
            cancelAnimationFrame(this._resizeId);
        }

        this._resizeId = requestAnimationFrame(() => {
            const { width, height } = this._pendingSize!;
            this.app.renderer.resize(width, height);
            this.app.render()
            this._resizeId = null;
        });
    }

    sizeData(): SizeData {
        return {
            width: this._canvas.clientWidth,
            height: this._canvas.clientHeight
        }
    }

    destroy(): void {
        this.app.destroy()
    }
}
