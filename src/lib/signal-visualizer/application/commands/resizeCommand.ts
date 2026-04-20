import type { EventToMediate } from '../../utils/eventMediator.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'

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
