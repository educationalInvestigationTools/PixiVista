import { OneDimSignals, type RenderModel } from '@/lib/signal-visualizer/core/renderer.ts'
import { Application } from 'pixi.js'
import { ComponentLayer } from '@/lib/signal-visualizer/infrastructure/rendering/componentLayer/componentLayer.ts'
import { ComponentLayout } from '@/lib/signal-visualizer/infrastructure/rendering/componentLayer/layout.ts'
import { OneDimensionalSignalData } from '@/lib/signal-visualizer/infrastructure/rendering/oneDimensionalSignalData.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types.ts'

export class PixiRenderer {
    private readonly _canvas: HTMLCanvasElement
    private app: Application
    private renderModel?: RenderModel // source of truth, to render anything, search for it here.
    private componentLayer?: ComponentLayer

    constructor() {
        this._canvas = document.createElement('canvas')
        this._canvas.style.height = '100%'
        this._canvas.style.width = '100%'
        this._canvas.style.display = 'block'
        this.app = new Application()
    }

    async init(oneDimSignals: OneDimSignals) {
        const sizeData = {
            width: this._canvas.clientWidth,
            height: this._canvas.clientHeight,
        }
        this.renderModel = {
            sizeData,
            gridData: {
                verticalDivisions: 10,
                horizontalDivisions: 5,
            },
            oneDimSignals: oneDimSignals,
        }
        await this.app.init({
            width: sizeData.width,
            height: sizeData.height,
            canvas: this._canvas,
            backgroundAlpha: 0.2,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
        })
        this.componentLayer = new ComponentLayer(
            new ComponentLayout(this.renderModel.sizeData, {
                x: 0,
                y: 0,
            }),
            {
                min: oneDimSignals.viewPort.startSeconds,
                max: oneDimSignals.viewPort.startSeconds + oneDimSignals.viewPort.lengthSeconds,
            },
            this.renderModel.gridData.verticalDivisions,
        )
        for (const signal of oneDimSignals.channels) {
            const oneDimensionalSignalData = new OneDimensionalSignalData(
                signal.xSignal,
                signal.ySignal,
            )
            this.componentLayer.channelsLayer.addChannel(signal.label, oneDimensionalSignalData)
        }
        this.app.stage.addChild(this.componentLayer.container)
        this.app.ticker.add(() => this.componentLayer?.Draw())
    }

    destroy(): void {
        this.app.destroy()
    }

    async setSizes(sizeData: SizeData) {
        this.app.renderer.resize(sizeData.width, sizeData.height, window.devicePixelRatio)
        this.componentLayer?.updateSize(sizeData)
    }

    async updateSignalData(oneDimSignals: OneDimSignals) {
        this.renderModel!.oneDimSignals = oneDimSignals

        for (const signal of oneDimSignals.channels) {
            const label = signal.label
            const channelLayer = this.componentLayer?.channelsLayer.getByLabel(label)
            if (channelLayer != undefined) {
                const oneDimensionalSignalData = new OneDimensionalSignalData(
                    signal.xSignal,
                    signal.ySignal,
                )
                channelLayer.updateData(oneDimensionalSignalData)
            }
        }

        this.componentLayer?.axisLayer.updateMinMaxValues({
            min: oneDimSignals.viewPort.startSeconds,
            max: oneDimSignals.viewPort.startSeconds + oneDimSignals.viewPort.lengthSeconds,
        })
    }

    get canvas(): HTMLCanvasElement {
        return this._canvas
    }

    addChannel(label: string, oneDimensionalSignalData: OneDimensionalSignalData) {
        this.componentLayer?.channelsLayer.addChannel(label, oneDimensionalSignalData)
    }

    removeChannel(label: string) {
        this.componentLayer?.channelsLayer.removeChannel(label)
    }
}
