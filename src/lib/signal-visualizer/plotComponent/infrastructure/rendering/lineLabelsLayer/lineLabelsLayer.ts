import { LayoutDesign } from "@/lib/signal-visualizer/core/rendering/layoutDesign";
import { RenderLayer } from "@/lib/signal-visualizer/core/rendering/renderLayer";
import type { PositionData } from "@/lib/signal-visualizer/core/types/positionData";
import type { SizeData } from "@/lib/signal-visualizer/core/types/sizeData";
import { LabelLayer } from "../labelsLayer/labelLayer";
import { generateRandomString } from "@/lib/signal-visualizer/debugComponents/labelsLayer/utils/utils";
import { LineLabelsLayout } from "./lineLabelsLayout";
import { type LineLayerDescription } from "./types/lineLayerDescription";



export class LineLabelsLayer extends RenderLayer<LineLabelsLayout> {
    labels: LabelLayer[] = []
    constructor(description: LineLayerDescription) {
        super(new LineLabelsLayout({ width: 0, height: 0 }, { x: 0, y: 0 }, description))
        const n = this.layoutDesign.description.positionsNormalized.length
        this.layoutDesign.description.positionsNormalized.map((x, i) => {
            const labelLayer = new LabelLayer({
                text: generateRandomString(10, 200),
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

    updateLabelText(i: number, text: string) {
        const n = this.layoutDesign.description.positionsNormalized.length
        this.labels[i]?.updateLabelDescription({
            text: text,
            textAlignment: this.layoutDesign.description.alignmentCallback(i, n)
        })
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
    }
}
