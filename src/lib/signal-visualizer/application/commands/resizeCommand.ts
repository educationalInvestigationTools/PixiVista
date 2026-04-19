import type { EventToMediate } from '../../utils/eventMediator'

export const ResizeCommandEventLabel = "ResizeCommandEventLabel"

export class ResizeCommand implements EventToMediate {
    eventLabel: string = ResizeCommandEventLabel
    width: number
    height: number

    constructor(width: number, height: number) {
        this.width = width
        this.height = height
    }
}
