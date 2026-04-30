import type { Point2D } from "@/lib/signal-visualizer/core/types/point2D"
import type { EventToMediate } from "@/lib/signal-visualizer/utils/eventMediator"

export const ChangeCellTextCommandEventLabel = 'ChangeCellTextCommandEventLabel'

export class ChangeCellTextCommand implements EventToMediate {
    eventLabel: string = ChangeCellTextCommandEventLabel
    text: string
    positionData: Point2D

    constructor(text: string, positionData: Point2D) {
        this.text = text
        this.positionData = positionData
    }
}
