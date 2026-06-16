import type { EventToMediate } from '@/utils/eventMediator.ts'

export const ChangeCanvasResolutionCommandLabel = "ChangeCanvasResolutionCommandLabel"

export class ChangeCanvasResolutionCommand implements EventToMediate {
    eventLabel: string = ChangeCanvasResolutionCommandLabel
    proportion: number

    constructor(proportion: number) {
        this.proportion = proportion
    }
}
