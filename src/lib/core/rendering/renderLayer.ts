import { Container, Graphics } from 'pixi.js'

import type { SizeData } from '@/core/types/sizeData'
import type { Point2D } from '@/core/types/point2D'
import type { LayoutDesign } from '@/core/rendering/layoutDesign'

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
            this._needsRendering = false
        }
        for (const child of this.Children) {
            child.Draw()
        }
    }

    abstract get Children(): RenderLayer<LayoutDesign>[]

    updatePosition(positionData: Point2D) {
        this._updatePosition(positionData)
        this._needsRendering = true
    }
    protected abstract _updatePosition(positionData: Point2D): void

    updateSize(sizeData: SizeData) {
        this._updateSize(sizeData)
        this._needsRendering = true
    }
    protected abstract _updateSize(sizeData: SizeData): void

    destroy() {
        this._destroy()
        for (const child of this.Children) {
            child.destroy()
        }
        this.graphics.destroy()
        this.container.destroy()
    }
    protected abstract _destroy(): void
}
