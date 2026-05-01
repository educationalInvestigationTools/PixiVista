/*
Source: https://github.com/devoxi/lttb-py/blob/master/lttb/lttb.py
*/

import type { OneDimSignalRaw } from "@/plotComponent/application/interfaces/signalSource"


export function largestTriangleThreeBuckets(
    data: OneDimSignalRaw,
    threshold: number,
): OneDimSignalRaw {
    const dataLength = data.xValues.length
    if (threshold <= 1 || threshold >= dataLength) {
        return { xValues: data.xValues, yValues: data.yValues }
    }

    const every = (dataLength - 2) / (threshold - 2)
    let a = 0,
        nextA = 0,
        maxAreaPoint = [0, 0]
    const sampledX: number[] = [data.xValues[0]!]
    const sampledY: number[] = [data.yValues[0]!]

    for (let i = 0; i < threshold - 2; i++) {
        let avgX = 0,
            avgY = 0
        let avgRangeStart = Math.floor((i + 1) * every) + 1
        const avgRangeEnd = Math.min(Math.floor((i + 2) * every) + 1, dataLength)
        const avgRangeLength = avgRangeEnd - avgRangeStart

        while (avgRangeStart < avgRangeEnd) {
            avgX += data.xValues[avgRangeStart]!
            avgY += data.yValues[avgRangeStart]!
            avgRangeStart++
        }
        avgX /= avgRangeLength
        avgY /= avgRangeLength

        let rangeOffs = Math.floor(i * every) + 1
        const rangeTo = Math.floor((i + 1) * every) + 1

        const pointAx = data.xValues[a]!
        const pointAy = data.yValues[a]!

        let maxArea = -1
        while (rangeOffs < rangeTo) {
            const area =
                Math.abs(
                    (pointAx - avgX) * (data.yValues[rangeOffs]! - pointAy) -
                        (pointAx - data.xValues[rangeOffs]!) * (avgY - pointAy),
                ) * 0.5

            if (area > maxArea) {
                maxArea = area
                maxAreaPoint = [data.xValues[rangeOffs]!, data.yValues[rangeOffs]!]
                nextA = rangeOffs
            }
            rangeOffs++
        }
        sampledX.push(maxAreaPoint[0]!)
        sampledY.push(maxAreaPoint[1]!)
        a = nextA
    }
    sampledX.push(data.xValues[dataLength - 1]!)
    sampledY.push(data.yValues[dataLength - 1]!)

    return {
        xValues: new Float32Array(sampledX),
        yValues: new Float32Array(sampledY),
    }
}
