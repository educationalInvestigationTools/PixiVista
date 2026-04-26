import type { EventToMediate } from "@/lib/signal-visualizer/utils/eventMediator"

export const ChangeAllCellsTextCommandEventLabel = "ChangeAllCellsTextCommandEventLabel"

export class ChangeAllCellsTextCommand implements EventToMediate {
    eventLabel: string = ChangeAllCellsTextCommandEventLabel
}
