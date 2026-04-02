import { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'

import type { MinMaxValues, PositionData, SizeData } from '@/lib/signal-visualizer/core/types.ts'

export class AxisLayerBaseLayout extends LayoutDesign {
    divisions: number

    constructor(sizeData: SizeData, positionData: PositionData, divisions: number) {
        super(sizeData, positionData)
        this.divisions = divisions
    }

    get yCoordinate() {
        return this.height * 0.2
    }

    xDivision(i: number) {
        return (i / this.divisions) * this.width
    }
}

export class LabelsAxisLayerLayout extends AxisLayerBaseLayout {
    static readonly LABEL_FONT_SIZE = 14

    minMaxValues: MinMaxValues

    constructor(
        sizeData: SizeData,
        positionData: PositionData,
        divisions: number,
        minMaxValues: MinMaxValues,
    ) {
        super(sizeData, positionData, divisions)
        this.minMaxValues = minMaxValues
    }

    get stepSize(): number {
        return (this.minMaxValues.max - this.minMaxValues.min) / this.divisions
    }

    textValue(i: number): string {
        return (this.minMaxValues.min + i * this.stepSize).toPrecision(2)
    }

    get fontSize() {
        return LabelsAxisLayerLayout.LABEL_FONT_SIZE
    }

    get minFontSize(): number {
        return 1
    }

    get maxLabelHeightAvailable(): number {
        const bottomPadding = 1
        return Math.max(this.height - this.yCoordinate - bottomPadding, 1)
    }

    fittedFontSize(maxLabelHeightAtBaseFont: number): number {
        if (maxLabelHeightAtBaseFont <= this.maxLabelHeightAvailable) {
            return this.fontSize
        }

        const scaledSize = Math.floor(
            (this.fontSize * this.maxLabelHeightAvailable) / maxLabelHeightAtBaseFont,
        )
        return Math.max(this.minFontSize, scaledSize)
    }
}

export class AxisLayerLayout extends AxisLayerBaseLayout {
    get circleRadius(): number {
        return this.height * 0.05
    }

    get labelsLayerSize(): SizeData {
        return { width: this.width, height: this.height }
    }

    get labelsLayerPosition(): PositionData {
        return { x: 0, y: 0 }
    }
}
