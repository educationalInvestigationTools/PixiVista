import { RenderLayer } from "@/lib/signal-visualizer/core/rendering/renderLayer";
import type { LabelLayout } from "./labelLayout";
import type { LayoutDesign } from "@/lib/signal-visualizer/core/rendering/layoutDesign";
import type { PositionData } from "@/lib/signal-visualizer/core/types/positionData";
import type { SizeData } from "@/lib/signal-visualizer/core/types/sizeData";

import { CanvasTextMetrics, Text, TextStyle } from "pixi.js";

export type LabelDescription = {
    text: string
}

const LABEL_COLOR = '#d1d5db'
const LABEL_FONT_WEIGHT = 'bold'

export class LabelLayer extends RenderLayer<LabelLayout> {
    private labelDescription: LabelDescription
    private textGraphics?: Text
    private textStyleByFontSize = new Map<number, TextStyle>()

    constructor(layoutData: LabelLayout, labelDescription: LabelDescription) {
        super(layoutData)
        this.labelDescription = labelDescription
    }

    protected _draw(): void {
        this.removeCurrentText()

        if (this.labelDescription.text.length === 0) {
            return
        }

        const fittedFontSize = this.resolveLargestFittedFontSize(this.labelDescription.text)
        if (fittedFontSize === undefined) {
            return
        }

        const text = this.buildText(this.labelDescription.text, fittedFontSize)
        text.x = this.layoutDesign.centeredX(text.width)
        text.y = this.layoutDesign.centeredY(text.height)

        this.container.addChild(text)
        this.textGraphics = text

    }

    get Children(): RenderLayer<LayoutDesign>[] {
        return []
    }

    protected _updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
    }

    protected _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
    }

    public updateLabelDescription(labelDescription: LabelDescription) {
        this.labelDescription = labelDescription
        this._needsRendering = true
    }

    private removeCurrentText(): void {
        if (this.textGraphics === undefined) {
            return
        }
        this.container.removeChild(this.textGraphics)
        this.textGraphics.destroy()
        this.textGraphics = undefined
    }

    private buildText(textValue: string, fontSize: number): Text {
        return new Text({
            text: textValue,
            style: this.resolveTextStyle(fontSize),
        })
    }

    private resolveTextStyle(fontSize: number): TextStyle {
        const cachedStyle = this.textStyleByFontSize.get(fontSize)
        if (cachedStyle !== undefined) {
            return cachedStyle
        }

        const textStyle = new TextStyle({
            fontSize,
            fontWeight: LABEL_FONT_WEIGHT,
            fill: LABEL_COLOR,
        })
        this.textStyleByFontSize.set(fontSize, textStyle)
        return textStyle
    }

    private canTextFit(textValue: string, fontSize: number): boolean {
        const measuredText = CanvasTextMetrics.measureText(textValue, this.resolveTextStyle(fontSize))
        const fits =
            measuredText.width <= this.layoutDesign.width
            && measuredText.height <= this.layoutDesign.height
        return fits
    }

    private resolveLargestFittedFontSize(textValue: string): number | undefined {
        const minFontSize = this.layoutDesign.minFontSize
        const maxFontSize = this.layoutDesign.maxFontSize
        if (!this.canTextFit(textValue, minFontSize)) {
            return undefined
        }

        let low = minFontSize
        let high = Math.max(low, maxFontSize)

        while (low < high) {
            const mid = Math.ceil((low + high) / 2)
            if (this.canTextFit(textValue, mid)) {
                low = mid
                continue
            }
            high = mid - 1
        }

        return low
    }
}
