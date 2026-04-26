import type { PositionData } from "@/lib/signal-visualizer/core/types/positionData"
import type { EventToMediate } from "@/lib/signal-visualizer/utils/eventMediator"

export const ChangeCellTextCommandEventLabel = 'ChangeCellTextCommandEventLabel'

export class ChangeCellTextCommand implements EventToMediate {
    eventLabel: string = ChangeCellTextCommandEventLabel
    text: string
    positionData: PositionData

    constructor(text: string, positionData: PositionData) {
        this.text = text
        this.positionData = positionData
    }
}
