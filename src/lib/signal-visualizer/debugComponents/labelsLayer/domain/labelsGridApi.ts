import type { PositionData } from "@/lib/signal-visualizer/core/types/positionData";
import { RenderLayerDomainApi } from "../../../core/rendering/layerApi";
import type { EventMediator, EventToMediate } from "../../../utils/eventMediator";
import { LabelsGrid } from "./labelsGrid";

export const ChangeCellTextCommandEventLabel = 'ChangeCellTextCommandEventLabel'

export class ChangeCellTextCommand implements EventToMediate {
    eventLabel: string = ChangeCellTextCommandEventLabel
    text: string
    positionData : PositionData

    constructor(text: string, positionData : PositionData) {
        this.text = text
        this.positionData = positionData
    }
}


export class LabelsGridApi extends RenderLayerDomainApi<LabelsGrid> {
    constructor(component: LabelsGrid, eventMediator: EventMediator) {
        super(component, eventMediator)
    }
    registerEvents(): void {
        this.eventMediator.addHandler<ChangeCellTextCommand>(ChangeCellTextCommandEventLabel, (command) => {
            this.component.updateLabelText(command.text, command.positionData)
            return Promise.resolve()
        })
    }
}
