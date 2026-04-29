import { RenderLayerDomainApi } from '../../../core/rendering/layerApi'
import type { EventMediator } from '../../../utils/eventMediator'
import { LabelsGridLayer } from '../infrastructure/rendering/labelsGridLayer.ts'
import { generateRandomString } from '../utils/utils'
import {
    ChangeCellTextCommandEventLabel,
    type ChangeCellTextCommand,
} from '../application/commands/changeCellTextCommand'
import {
    ChangeAllCellsTextCommandEventLabel,
    type ChangeAllCellsTextCommand,
} from '../application/commands/changeAllCellsTextCommand'

export class LabelsGridApi extends RenderLayerDomainApi<LabelsGridLayer> {
    constructor(component: LabelsGridLayer, eventMediator: EventMediator) {
        super(component, eventMediator)
    }

    registerEvents(): void {
        this.eventMediator.addHandler<ChangeCellTextCommand>(
            ChangeCellTextCommandEventLabel,
            (command) => {
                const [row, column] = this.component.getRowAndColumn(command.positionData)
                this.component.updateLabelText(command.text, row, column)
                return Promise.resolve()
            },
        )
        this.eventMediator.addHandler<ChangeAllCellsTextCommand>(
            ChangeAllCellsTextCommandEventLabel,
            (_command) => {
                const gridDescription = this.component.GridDescription
                for (let i = 0; i < gridDescription.columnsPerRow.length; i++) {
                    for (let j = 0; j < gridDescription.columnsPerRow[i]!; j++) {
                        this.component.updateLabelText(generateRandomString(10, 20), i, j)
                    }
                }
                return Promise.resolve()
            },
        )
    }
}
