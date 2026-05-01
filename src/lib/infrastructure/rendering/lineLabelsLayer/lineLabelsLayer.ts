import type { LayoutDesign } from "@/core/rendering/layoutDesign"
import { RenderLayer } from "@/core/rendering/renderLayer"
import type { Point2D } from "@/core/types/point2D"
import type { SizeData } from "@/core/types/sizeData"
import { LabelLayer } from "@/infrastructure/rendering/labelLayer/labelLayer"
import { LineLabelsLayout } from "@/infrastructure/rendering/lineLabelsLayer/lineLabelsLayout"
import type { LineLayerDescription } from "@/infrastructure/rendering/lineLabelsLayer/types/lineLayerDescription"


export class LineLabelsLayer extends RenderLayer<LineLabelsLayout> {
    labels: LabelLayer[] = []
    constructor(description: LineLayerDescription) {
        super(new LineLabelsLayout(description))
        const n = this.layoutDesign.description.positionsNormalized.length
        this.layoutDesign.description.positionsNormalized.map((x, i) => {
            const labelLayer = new LabelLayer({
                text: '',
                textAlignment: this.layoutDesign.description.alignmentCallback(i, n),
            })
            this.labels.push(labelLayer)
            this.container.addChild(labelLayer.container)
        })
    }

    protected _draw(): void {
        this.labels.map((x, i) => {
            const sizeData = this.layoutDesign.buildLabelSize(i)
            const posData = this.layoutDesign.buildLabelPosition(i)
            this.graphics.rect(posData.x, posData.y, sizeData.width, sizeData.height).stroke({
                width: 2,
                color: 'green',
            })
        })
    }
    get Children(): RenderLayer<LayoutDesign>[] {
        return this.labels
    }

    updateLabelsText(texts: string[]) {
        texts.map((x, i) => this.labels[i]?.updateText(x))
        this.updateSharedFont()
    }
    updateSharedFont() {
        const fittedFonts = this.labels.map((x) => x.FittedFontSize).filter((x) => x !== undefined)
        if (fittedFonts.length > 0) {
            const minFontSize = Math.min(...fittedFonts)
            this.labels.map((x) => (x.CustomFontSize = minFontSize))
        }
    }

    protected _updatePosition(positionData: Point2D): void {
        this.layoutDesign.updatePosData(positionData)
        this.labels.map((x, i) => x.updatePosition(this.layoutDesign.buildLabelPosition(i)))
    }
    protected _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
        this.labels.map((x, i) => {
            x.updateSize(this.layoutDesign.buildLabelSize(i))
            x.updatePosition(this.layoutDesign.buildLabelPosition(i))
        })
        this.updateSharedFont()
    }

    protected _destroy(): void {

    }
}
