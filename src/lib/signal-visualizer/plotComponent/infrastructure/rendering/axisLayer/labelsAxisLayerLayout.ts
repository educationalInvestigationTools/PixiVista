import { AxisLayerBaseLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/axisLayer/axisLayerBaseLayout.ts'
import type { MinMaxValues } from '@/lib/signal-visualizer/plotComponent/application/types/minMaxValues.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'

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
        return (this.minMaxValues.min + i * this.stepSize).toFixed(2)
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
