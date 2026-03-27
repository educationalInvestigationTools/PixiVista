import { Application } from 'pixi.js'

export class PixiRenderer {
    private readonly _canvas: HTMLCanvasElement
    app: Application

    constructor() {
        this._canvas = document.createElement('canvas')
        this._canvas.style.height = '100%'
        this._canvas.style.width = '100%'
        this._canvas.style.display = 'block'
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
            backgroundAlpha: 0.2,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            resizeTo: this._canvas.parentElement!,
        })
    }

    destroy(): void {
        this.app.destroy()
    }
    get canvas(): HTMLCanvasElement {
        return this._canvas
    }
}
