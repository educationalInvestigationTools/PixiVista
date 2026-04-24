export type MetricsTimeStamp = {
    timeStampMs: number
}

export function areEqual(one: MetricsTimeStamp, two: MetricsTimeStamp) {
    return one.timeStampMs === two.timeStampMs
}

export function clone(one: MetricsTimeStamp) {
    return {
        timeStampMs: one.timeStampMs
    }
}
