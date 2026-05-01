import type { Point2D } from "@/core/types/point2D"
import type { EventToMediate } from "@/utils/eventMediator"

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
