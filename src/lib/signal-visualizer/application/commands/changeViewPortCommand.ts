import type { ViewPort } from '../types/viewPort'
import type { EventToMediate } from '../../utils/eventMediator'

export const ChangeViewPortCommandEventLabel = "ChangeViewPortCommandEventLabel"

export class ChangeViewPortCommand implements EventToMediate {
    eventLabel : string = ChangeViewPortCommandEventLabel
    viewPort : ViewPort

    constructor(viewPort: ViewPort) {
        this.viewPort = viewPort
    }
}
