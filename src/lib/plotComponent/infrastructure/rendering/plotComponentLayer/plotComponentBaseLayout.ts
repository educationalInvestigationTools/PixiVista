import { LayoutDesign } from "@/core/rendering/layoutDesign"

export class PlotComponentBaseLayout extends LayoutDesign {
    get marginVerticalLeft(): number {
        return this.width * 0.01
    }

    get marginVerticalRight(): number {
        return this.width * 0.01
    }

    get xLeft(): number {
        return this.marginVerticalLeft
    }

    get xRight(): number {
        return this.width - this.marginVerticalRight
    }

    get widthAfterMargin(): number {
        return this.xRight - this.xLeft
    }
}
