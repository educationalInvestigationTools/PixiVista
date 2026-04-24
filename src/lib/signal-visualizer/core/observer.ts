export abstract class Observer<T> {
    private lastObservedValue: T | null = null
    protected readonly debouncedRefreshRate
    private readonly areEqual: (arg0: T, arg1: T) => boolean
    private readonly clone: (arg0: T) => T
    private readonly currentValueObserver: () => T

    protected constructor(
        areEqual: (arg0: T, arg1: T) => boolean,
        clone: (arg0: T) => T,
        currentValue: () => T,
        callsPerSecond : number = 30
    ) {
        this.areEqual = areEqual
        this.clone = clone
        this.currentValueObserver = currentValue
        this.debouncedRefreshRate = 1000 / callsPerSecond
    }

    async init() {
        setInterval(async () => {
            let flag = true
            const nextObservedValue = this.currentValueObserver()
            if (this.lastObservedValue !== null) {
                if (this.areEqual(nextObservedValue, this.lastObservedValue)) {
                    flag = false
                }
            }
            if (flag) {
                const cloned = this.clone(nextObservedValue)
                await this.update(cloned)
                this.lastObservedValue = cloned
            }
        }, this.debouncedRefreshRate)
    }

    abstract update(currentObserved: T): Promise<void>

    abstract destroy(): Promise<void>
}
