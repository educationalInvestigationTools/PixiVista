import type { EventToMediate } from '@/lib/signal-visualizer/utils/eventMediator.ts'

export const ChangeRollingWindowMsCommandEventLabel = 'ChangeRollingWindowMsCommandEventLabel'

export class ChangeRollingWindowMsCommand implements EventToMediate {
    readonly eventLabel: string = ChangeRollingWindowMsCommandEventLabel
    readonly windowMs: number

    constructor(windowMs: number) {
        this.windowMs = windowMs
    }
}
