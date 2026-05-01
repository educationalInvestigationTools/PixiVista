import { LayoutDesign } from "@/core/rendering/layoutDesign"

export class LabelLayout extends LayoutDesign {
    get minFontSize(): number {
        return 1
    }

    get maxFontSize(): number {
        const minDimension = Math.min(this.width, this.height)
        return Math.min(Math.max(this.minFontSize, minDimension), 25)
    }

    centeredX(textWidth: number): number {
        return (this.width - textWidth) / 2
    }

    centeredY(textHeight: number): number {
        return (this.height - textHeight) / 2
    }
}
