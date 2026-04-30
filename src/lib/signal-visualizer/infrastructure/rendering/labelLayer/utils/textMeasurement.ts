import { CanvasTextMetrics, TextStyle } from 'pixi.js'
import type { TextAlignments } from '../types/types.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { MinMaxValues } from '@/lib/signal-visualizer/plotComponent/application/types/minMaxValues.ts'

const LABEL_FONT_WEIGHT = 'bold'
const LABEL_COLOR = '#d1d5db'
export class MeasureText {
    private textStyleByFontSizeAndAlignment = new Map<string, TextStyle>()
    resolveTextStyle(fontSize: number, textAlignment: TextAlignments): TextStyle {
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
        sizeData: SizeData,
    ): boolean {
        const measuredText = CanvasTextMetrics.measureText(
            textValue,
            this.resolveTextStyle(fontSize, textAlignment),
        )
        const fits = measuredText.width <= sizeData.width && measuredText.height <= sizeData.height
        return fits
    }

    resolveLargestFittedFontSize(
        textValue: string,
        textAlignment: TextAlignments,
        sizeData: SizeData,
        minMaxFontSize: MinMaxValues,
    ): number | undefined {
        const minFontSize = minMaxFontSize.min
        const maxFontSize = minMaxFontSize.max
        if (!this.canTextFit(textValue, minFontSize, textAlignment, sizeData)) {
            return undefined
        }

        let low = minFontSize
        let high = Math.max(low, maxFontSize)

        while (low < high) {
            const mid = Math.ceil((low + high) / 2)
            if (this.canTextFit(textValue, mid, textAlignment, sizeData)) {
                low = mid
                continue
            }
            high = mid - 1
        }

        return low
    }
}
