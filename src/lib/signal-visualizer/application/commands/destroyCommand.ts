import type { EventToMediate } from '../../utils/eventMediator'

export const DestroyCommandEventLabel = "DestroyCommandEventLabel"

export class DestroyCommand implements EventToMediate {
    eventLabel: string = DestroyCommandEventLabel
    constructor() { }
}
