import type { SizeData } from '@/core/types/sizeData'
import { Application } from 'pixi.js'


export class PixiRenderer {
    private readonly _canvas: HTMLCanvasElement
    private maxTextureSize: number = 8192
    app: Application

    private _resizeId: number | null = null
    private _pendingSize: SizeData | null = null

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas
        this.app = new Application()

    }

    getMaxSafeResolution(width: number, height: number): number {
        return Math.min(
            this.maxTextureSize / width,
            this.maxTextureSize / height,
        )
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
            backgroundAlpha : 1,
            resolution: window.devicePixelRatio,
            autoDensity: false,
        })
        const gl = this._canvas.getContext('webgl');
        if (gl) {
            this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE)
        }
    }

    async resize(sizeData: SizeData) {
        this._pendingSize = sizeData
        if (this._resizeId !== null) {
            cancelAnimationFrame(this._resizeId)
        }

        this._resizeId = requestAnimationFrame(() => {
            const { width, height } = this._pendingSize!
            const resolution = Math.min(5, Math.floor(this.getMaxSafeResolution(width, height)))
            this.app.renderer.resize(width, height, resolution)
            this.app.render()
            this._resizeId = null
        })
    }

    sizeData(): SizeData {
        const rect = this._canvas.getBoundingClientRect()
        return {
            width: rect.width,
            height: rect.height,
        }
    }
    get resolution(): number {
        return this.app.renderer.resolution
    }

    destroy(): void {
        this.app.destroy()
    }
}
