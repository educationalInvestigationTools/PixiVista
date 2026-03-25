export type MinMaxValues = {
    min: number
    max: number
}
export type GridData = {
    horizontalDivisions: number
    verticalDivisions: number
}
export type PositionData = {
    x: number
    y: number
}
export type SizeData = {
    width: number
    height: number
}

export type AxisSignal = {
    valuesNormalized: Float32Array
    minMaxValues: MinMaxValues
}

export type OneDimSignal = {
    label: string
    xSignal: AxisSignal
    ySignal: AxisSignal
}
