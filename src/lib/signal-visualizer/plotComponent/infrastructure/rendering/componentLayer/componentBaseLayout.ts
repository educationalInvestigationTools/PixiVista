import { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'

export class ComponentBaseLayout extends LayoutDesign {
    get marginVerticalLeft(): number {
        return this.width * 0.05
    }

    get marginVerticalRight(): number {
        return this.width * 0.05
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
