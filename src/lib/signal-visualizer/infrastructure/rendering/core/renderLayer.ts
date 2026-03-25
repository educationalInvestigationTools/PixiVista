import { Container, Graphics } from 'pixi.js'
import type { LayoutDesign } from '@/lib/signal-visualizer/infrastructure/rendering/core/layoutDesign.ts'
import type { PositionData, SizeData } from '@/lib/signal-visualizer/core/types.ts'

export abstract class RenderLayer<LayoutData extends LayoutDesign> {
    protected graphics: Graphics = new Graphics()
    container: Container = new Container()
    layoutDesign: LayoutData
    protected _needsRendering: boolean = true

    protected constructor(layoutData: LayoutData) {
        this.layoutDesign = layoutData
        this.container.addChild(this.graphics)
    }

    protected abstract _draw(): void

    Draw(): void {
        this.container.position.set(this.layoutDesign.x, this.layoutDesign.y)
        if (this._needsRendering) {
            this.graphics.clear()
            this._draw()
            this.graphics
                .rect(0, 0, this.layoutDesign.width, this.layoutDesign.height)
                .fill({
                    width: 1,
                    color: 'orange',
                    alpha: 0.2,
                })
                .stroke({
                    color: 'black',
                })
            this._needsRendering = false
        }
        for (const child of this.Children) {
            child.Draw()
        }
    }

    abstract get Children(): RenderLayer<LayoutDesign>[]

    updatePosition(positionData: PositionData) {
        this._updatePosition(positionData)
        this._needsRendering = true
    }
    protected abstract _updatePosition(positionData: PositionData): void

    updateSize(sizeData: SizeData) {
        this._updateSize(sizeData)
        this._needsRendering = true
    }
    protected abstract _updateSize(sizeData: SizeData): void
}
