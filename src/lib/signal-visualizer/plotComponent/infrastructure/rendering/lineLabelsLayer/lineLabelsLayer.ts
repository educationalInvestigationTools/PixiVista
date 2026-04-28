import { LayoutDesign } from "@/lib/signal-visualizer/core/rendering/layoutDesign";
import { RenderLayer } from "@/lib/signal-visualizer/core/rendering/renderLayer";
import type { PositionData } from "@/lib/signal-visualizer/core/types/positionData";
import type { SizeData } from "@/lib/signal-visualizer/core/types/sizeData";
import { LabelLayer } from "../labelsLayer/labelLayer";
import { LineLabelsLayout } from "./lineLabelsLayout";
import { type LineLayerDescription } from "./types/lineLayerDescription";



export class LineLabelsLayer extends RenderLayer<LineLabelsLayout> {
    labels: LabelLayer[] = []
    constructor(description: LineLayerDescription) {
        super(new LineLabelsLayout({ width: 0, height: 0 }, { x: 0, y: 0 }, description))
        const n = this.layoutDesign.description.positionsNormalized.length
        this.layoutDesign.description.positionsNormalized.map((x, i) => {
            const labelLayer = new LabelLayer({
                text: "",
                textAlignment: this.layoutDesign.description.alignmentCallback(i, n)
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
                color: 'green'
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

    updateLabelText(i: number, text: string) {
        this.labels[i]?.updateText(text)
    }

    updateSharedFont() {
        const fittedFonts = this.labels.map(x => x.FittedFontSize).filter(x => x !== undefined)
        if (fittedFonts.length > 0) {
            const minFontSize = Math.min(...fittedFonts)
            this.labels.map(x => x.CustomFontSize = minFontSize)
        }

    }

    protected _updatePosition(positionData: PositionData): void {
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
}
