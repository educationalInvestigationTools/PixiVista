import type { SizeData } from '@/core/types/sizeData'
import type { EventToMediate } from '@/utils/eventMediator.ts'

export const ResizeCommandEventLabel = 'ResizeCommandEventLabel'

export class ResizeCommand implements EventToMediate {
    eventLabel: string = ResizeCommandEventLabel
    sizeData: SizeData

    constructor(width: number, height: number) {
        this.sizeData = {
            width,
            height,
        }
    }
}
