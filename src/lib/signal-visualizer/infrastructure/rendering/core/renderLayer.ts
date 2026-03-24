import { Container, Graphics } from 'pixi.js'
import type { LayoutDesign } from '@/lib/signal-visualizer/infrastructure/rendering/core/layoutDesign.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/positionData.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/sizeData.ts'

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
            this._draw()
            this._needsRendering = false
        }
        for (const child of this.Children) {
            child.Draw()
        }
    }

    abstract get Children(): RenderLayer<LayoutDesign>[]
    abstract updatePosition(positionData: PositionData): void
    abstract updateSize(sizeData: SizeData): void
}
