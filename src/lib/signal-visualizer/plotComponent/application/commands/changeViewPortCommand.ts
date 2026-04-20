import type {ViewPort} from '../types/viewPort.ts'
import type {EventToMediate} from '../../../utils/eventMediator.ts'

export const ChangeViewPortCommandEventLabel = "ChangeViewPortCommandEventLabel"

export class ChangeViewPortCommand implements EventToMediate {
    eventLabel: string = ChangeViewPortCommandEventLabel
    viewPort: ViewPort

    constructor(viewPort: ViewPort) {
        this.viewPort = viewPort
    }
}
