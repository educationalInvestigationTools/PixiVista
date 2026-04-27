import { RenderLayer } from "@/lib/signal-visualizer/core/rendering/renderLayer";
import { LabelLayout } from "./labelLayout";
import type { LayoutDesign } from "@/lib/signal-visualizer/core/rendering/layoutDesign";
import type { PositionData } from "@/lib/signal-visualizer/core/types/positionData";
import type { SizeData } from "@/lib/signal-visualizer/core/types/sizeData";

import type { LabelDescription, TextAlignments} from "./types/types";
import { MeasureText } from "./utils/textMeasurement";
import { Text } from "pixi.js";


export class LabelLayer extends RenderLayer<LabelLayout> {
    private labelDescription: LabelDescription
    private textGraphics?: Text
    private measureText = new MeasureText()
    private _customFontSize?: number
    private _fittedFontSize?: number

    constructor(labelDescription: LabelDescription) {
        super(new LabelLayout({ width: 0, height: 0 }, { x: 0, y: 0 }))
        this.labelDescription = labelDescription
    }

    private setFittedFontSize() {
        const { text: labelText, textAlignment } = this.labelDescription

        const fittedFontSize = this.measureText.resolveLargestFittedFontSize(
            labelText,
            textAlignment,
            { width: this.layoutDesign.width, height: this.layoutDesign.height },
            { min: this.layoutDesign.minFontSize, max: this.layoutDesign.maxFontSize }
        )
        this._fittedFontSize = fittedFontSize
    }

    protected _draw(): void {
        this.removeCurrentText()

        if (this.labelDescription.text.length === 0) {
            return
        }
        const { text: labelText, textAlignment } = this.labelDescription
        if (this._fittedFontSize === undefined) {
            return
        }
        const fontToUse = this._customFontSize === undefined ? this._fittedFontSize : this._customFontSize
        const text = this.buildText(labelText, fontToUse, textAlignment)
        text.x = this.resolveTextX(text.width, textAlignment)
        text.y = this.layoutDesign.centeredY(text.height)

        this.container.addChild(text)
        this.textGraphics = text
    }

    get Children(): RenderLayer<LayoutDesign>[] {
        return []
    }

    set CustomFontSize(fontSize: number | undefined) {
        this._customFontSize = fontSize
    }

    get FittedFontSize(): number | undefined {
        return this._fittedFontSize
    }

    protected _updatePosition(positionData: PositionData): void {
        this.layoutDesign.updatePosData(positionData)
    }

    protected _updateSize(sizeData: SizeData): void {
        this.layoutDesign.updateSizeData(sizeData)
        this.setFittedFontSize()
    }

    public updateText(text : string) {
        this.labelDescription.text = text
        this.setFittedFontSize()
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
            style: this.measureText.resolveTextStyle(fontSize, textAlignment),
        })
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
