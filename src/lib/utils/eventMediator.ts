export interface EventToMediate {
    readonly eventLabel: string
}

export type MediatorHandler = (arg0: EventToMediate) => Promise<void>

export class EventMediator {
    handlers: Map<string, MediatorHandler[]> = new Map()

    constructor() {}

    addHandler<T extends EventToMediate>(eventLabel: string, handler: (arg0: T) => Promise<void>) {
        const handlers = this.handlers.get(eventLabel)
        if (handlers === undefined) {
            this.handlers.set(eventLabel, [])
        }
        const closure = async (arg0: EventToMediate) => {
            if (arg0.eventLabel === eventLabel) {
                await handler(arg0 as T)
            }
        }
        this.handlers.get(eventLabel)?.push(closure)
    }

    async publish(event: EventToMediate) {
        const handlers = this.handlers.get(event.eventLabel)
        if (handlers !== undefined) {
            for (const handler of handlers) {
                await handler(event)
            }
        }
    }
}
