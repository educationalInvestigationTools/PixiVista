export class EventMediator<T> {
    callback: (arg0: T) => void
    constructor(fn: (arg0: T) => void) {
        this.callback = fn
    }

    publish(event: T): void {
        this.callback(event)
    }
}
