import type { SizeData } from '@/core/types/sizeData'
import { Application, WebGLRenderer } from 'pixi.js'


export class PixiRenderer {
    private readonly _canvas: HTMLCanvasElement
    private maxRendererBufferSize: number = 0
    private maxTextureSize: number = 0
    private maxViewPortDims: [number, number] = [0, 0]
    private proportion = 0.5
    app: Application

    private _resizeId: number | null = null
    private _pendingSize: SizeData | null = null

    constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas
        this.app = new Application()

    }

    getMaxSafeResolution(width: number, height: number): number {
        const absoluteMaxWidth = Math.min(this.maxTextureSize, this.maxRendererBufferSize, this.maxViewPortDims[0])
        const absoluteMaxHeight = Math.min(this.maxTextureSize, this.maxRendererBufferSize, this.maxViewPortDims[1])
        return Math.min(
            absoluteMaxWidth / width,
            absoluteMaxHeight / height
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
            backgroundAlpha: 1,
            preference : 'webgl',
            resolution: window.devicePixelRatio,
            autoDensity: false,
        })
        const renderer = this.app.renderer as WebGLRenderer
        const gl = renderer.gl
        if (gl) {
            this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE)
            this.maxRendererBufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)
            this.maxViewPortDims = gl.getParameter(gl.MAX_VIEWPORT_DIMS)
        }
    }

    async updateResolutionProportion(proportion: number) {
        this.proportion = proportion
        const sizeData = this.sizeData()
        await this.resize(sizeData)
    }

    async resize(sizeData: SizeData) {
        this._pendingSize = sizeData
        if (this._resizeId !== null) {
            cancelAnimationFrame(this._resizeId)
        }

        this._resizeId = requestAnimationFrame(() => {
            const { width, height } = this._pendingSize!
            const maxResolution = this.getMaxSafeResolution(width, height)
            const minResolution = 0
            const resolution = minResolution + (maxResolution - minResolution) * this.proportion
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
        if (this.app.renderer === null) {
            return 1
        }
        return this.app.renderer.resolution
    }

    destroy(): void {
        this.app.destroy()
    }
}
