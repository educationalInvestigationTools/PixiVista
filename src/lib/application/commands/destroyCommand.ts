import type {EventToMediate} from '@/utils/eventMediator.ts'

export const DestroyCommandEventLabel = "DestroyCommandEventLabel"

export class DestroyCommand implements EventToMediate {
    eventLabel: string = DestroyCommandEventLabel

    constructor() {
    }
}
