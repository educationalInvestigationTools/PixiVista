import type { EventToMediate } from "@/utils/eventMediator"

export const ChangeAllCellsTextCommandEventLabel = "ChangeAllCellsTextCommandEventLabel"

export class ChangeAllCellsTextCommand implements EventToMediate {
    eventLabel: string = ChangeAllCellsTextCommandEventLabel
}
