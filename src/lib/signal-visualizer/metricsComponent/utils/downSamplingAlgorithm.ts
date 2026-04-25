import type { Point2D } from "../../core/types/point2D"
import type { MinMaxValues } from "../../plotComponent/application/types/minMaxValues"

export function downSamplingAlgorithm(points: Point2D[], outputSamples: number, minMaxValueX: MinMaxValues): Point2D[] {
    const delta = 1 / (outputSamples - 1) * (minMaxValueX.max - minMaxValueX.min)
    const times = []
    const values: [number, number][] = []
    for (let i = 0; i < outputSamples; i++) {
        times.push(minMaxValueX.min + i * delta)
        values.push([0, 0])
    }
    for (const point of points) {
        let group = 0
        for (let i = 0; i < outputSamples; i++) {
            if (Math.abs(point.x - times[group]!) > Math.abs(point.x - times[i]!)) {
                group = i
            }
        }
        values[group]![0] += point.y
        values[group]![1]++
    }

    const result: Point2D[] = []
    for (let i = 0; i < outputSamples; i++) {
        const x = times[i]!
        const y = values[i]![1] === 0 ? 0 : values[i]![0] / values[i]![1]
        result.push({
            x, y
        })
    }
    return result
}
