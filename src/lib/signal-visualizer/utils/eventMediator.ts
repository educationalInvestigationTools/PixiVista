export interface EventToMediate {
    readonly eventLabel: string

}

export type MediatorHandler = (arg0: EventToMediate) => Promise<void>

export class EventMediator {
    handlers: Map<string, MediatorHandler> = new Map()

    constructor() {}

    addHandler<T extends EventToMediate>(eventLabel: string, handler: (arg0: T) => Promise<void>) {
        this.handlers.set(eventLabel, async (arg0: EventToMediate) => {
            if (arg0.eventLabel === eventLabel) {
                await handler(arg0 as T)
            }
        })
    }

    async publish(event: EventToMediate) {
        const handler = this.handlers.get(event.eventLabel)
        if (handler !== undefined) {
            await handler(event)
        }
    }
}
