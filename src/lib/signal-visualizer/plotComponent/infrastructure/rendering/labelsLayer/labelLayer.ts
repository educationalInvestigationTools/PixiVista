import { RenderLayer } from "@/lib/signal-visualizer/core/rendering/renderLayer";
import { LabelLayout } from "./labelLayout";
import type { LayoutDesign } from "@/lib/signal-visualizer/core/rendering/layoutDesign";
import type { PositionData } from "@/lib/signal-visualizer/core/types/positionData";
import type { SizeData } from "@/lib/signal-visualizer/core/types/sizeData";

import { CanvasTextMetrics, Text, TextStyle } from "pixi.js";

export type TextAlignments = 'left' | 'center' | 'right'

export function alignmentIndex(i: number, length: number): TextAlignments {
    if (length === 1) return 'center'
    if (i === 0) return 'left'
    if (i === length - 1) return 'right'
    return 'center'
}

export type LabelDescription = {
    text: string
    textAlignment: TextAlignments
}

const LABEL_COLOR = '#d1d5db'
const LABEL_FONT_WEIGHT = 'bold'

export class LabelLayer extends RenderLayer<LabelLayout> {
    private labelDescription: LabelDescription
    private textGraphics?: Text
    private textStyleByFontSizeAndAlignment = new Map<string, TextStyle>()

    constructor(labelDescription: LabelDescription) {
        super(new LabelLayout({ width: 0, height: 0 }, { x: 0, y: 0 }))
        this.labelDescription = labelDescription
    }

    protected _draw(): void {
        this.removeCurrentText()

        if (this.labelDescription.text.length === 0) {
            return
        }

        const { text: labelText, textAlignment } = this.labelDescription

        const fittedFontSize = this.resolveLargestFittedFontSize(labelText, textAlignment)
        if (fittedFontSize === undefined) {
            return
        }

        const text = this.buildText(labelText, fittedFontSize, textAlignment)
        text.x = this.resolveTextX(text.width, textAlignment)
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

    private buildText(
        textValue: string,
        fontSize: number,
        textAlignment: TextAlignments,
    ): Text {
        return new Text({
            text: textValue,
            style: this.resolveTextStyle(fontSize, textAlignment),
        })
    }

    private resolveTextStyle(
        fontSize: number,
        textAlignment: TextAlignments,
    ): TextStyle {
        const cacheKey = `${fontSize}-${textAlignment}`
        const cachedStyle = this.textStyleByFontSizeAndAlignment.get(cacheKey)
        if (cachedStyle !== undefined) {
            return cachedStyle
        }

        const textStyle = new TextStyle({
            fontSize,
            fontWeight: LABEL_FONT_WEIGHT,
            fill: LABEL_COLOR,
            align: textAlignment,
        })
        this.textStyleByFontSizeAndAlignment.set(cacheKey, textStyle)
        return textStyle
    }

    private canTextFit(
        textValue: string,
        fontSize: number,
        textAlignment: TextAlignments,
    ): boolean {
        const measuredText = CanvasTextMetrics.measureText(
            textValue,
            this.resolveTextStyle(fontSize, textAlignment),
        )
        const fits =
            measuredText.width <= this.layoutDesign.width
            && measuredText.height <= this.layoutDesign.height
        return fits
    }

    private resolveLargestFittedFontSize(
        textValue: string,
        textAlignment: TextAlignments,
    ): number | undefined {
        const minFontSize = this.layoutDesign.minFontSize
        const maxFontSize = this.layoutDesign.maxFontSize
        if (!this.canTextFit(textValue, minFontSize, textAlignment)) {
            return undefined
        }

        let low = minFontSize
        let high = Math.max(low, maxFontSize)

        while (low < high) {
            const mid = Math.ceil((low + high) / 2)
            if (this.canTextFit(textValue, mid, textAlignment)) {
                low = mid
                continue
            }
            high = mid - 1
        }

        return low
    }

    private resolveTextX(
        textWidth: number,
        textAlignment: TextAlignments,
    ): number {
        if (textAlignment === 'left') {
            return 0
        }

        if (textAlignment === 'right') {
            return this.layoutDesign.width - textWidth
        }

        return this.layoutDesign.centeredX(textWidth)
    }
}
