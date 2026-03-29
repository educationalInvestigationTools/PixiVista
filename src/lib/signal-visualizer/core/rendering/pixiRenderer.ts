import { Application } from 'pixi.js'
import type { SizeData } from '../types'

export class PixiRenderer {
    private readonly _canvas: HTMLCanvasElement
    app: Application

    constructor(canvas : HTMLCanvasElement) {
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
            backgroundColor: "red",
            backgroundAlpha: 0.2,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            resizeTo: this._canvas.parentElement!,
        })
    }

    sizeData(): SizeData {
        return {
            width: this._canvas.clientWidth,
            height : this._canvas.clientHeight
        }
    }

    destroy(): void {
        this.app.destroy()
    }
}
