import { LayoutDesign } from "@/lib/signal-visualizer/core/rendering/layoutDesign";
import { RenderLayer } from "@/lib/signal-visualizer/core/rendering/renderLayer";
import type { PositionData } from "@/lib/signal-visualizer/core/types/positionData";
import type { SizeData } from "@/lib/signal-visualizer/core/types/sizeData";
import { alignmentIndex, LabelLayer } from "../labelsLayer/labelLayer";
import { generateRandomString } from "@/lib/signal-visualizer/debugComponents/labelsLayer/utils/utils";

export type LineLayerDescription = {
    positionsNormalized: number[] // 0 <= xi <= 1, sorted, sum xi = 1
}

export class LineLabelsLayout extends LayoutDesign {
    description: LineLayerDescription
    constructor(sizeData: SizeData, posData: PositionData, description: LineLayerDescription) {
        super(sizeData, posData)
        this.description = description
    }

    buildLabelPosition(i: number): PositionData {
        const n = this.description.positionsNormalized.length
        const positionsNormalized = this.description.positionsNormalized
        const y = 0
        if (n === 1) {
            return { x: 0, y: 0 }
        }

        if (i === 0) {
            return {
                x: 0,
                y,
            }
        }
        if (i === n - 1) {
            const distance = 1 - positionsNormalized[n - 2]!
            return {
                x: this.width - this.width * distance / 2,
                y,
            }
        }
        const prevDistance = (positionsNormalized[i]! - positionsNormalized[i - 1]!) / 2

        return {
            x: this.width * (positionsNormalized[i]! - prevDistance),
            y
        }
    }

    buildLabelSize(i: number): SizeData {
        const height = this.height
        const n = this.description.positionsNormalized.length
        const positionsNormalized = this.description.positionsNormalized

        if (n === 1) {
            return {
                width: this.width,
                height
            }
        }
        if (i === 0) {
            const distance = positionsNormalized[1]!
            return {
                width: this.width * distance / 2,
                height,
            }
        }
        if (i === n - 1) {
            const distance = positionsNormalized[n - 2]!
            return {
                width: this.width * distance / 2,
                height,
            }
        }
        const prevDistance = (positionsNormalized[i]! - positionsNormalized[i - 1]!) / 2
        const nextDistance = (positionsNormalized[i + 1]! - positionsNormalized[i]!) / 2

        return {
            width: this.width * (prevDistance + nextDistance),
            height
        }
    }

}

export class LineLabelsLayer extends RenderLayer<LineLabelsLayout> {
    labels: LabelLayer[] = []
    constructor(description: LineLayerDescription) {
        super(new LineLabelsLayout({ width: 0, height: 0 }, { x: 0, y: 0 }, description))
        const n = this.layoutDesign.description.positionsNormalized.length
        this.layoutDesign.description.positionsNormalized.map((x, i) => {
            const labelLayer = new LabelLayer({
                text: generateRandomString(10, 200),
                textAlignment: alignmentIndex(i, n)
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
            textAlignment: alignmentIndex(i, n)
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
