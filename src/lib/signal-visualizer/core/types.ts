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

export type NormalizedSignal = {
    values: Float32Array
    minMaxValues: MinMaxValues
}

export type OneDimNormalizedSignal = {
    label: string
    xSignal: NormalizedSignal
    ySignal: NormalizedSignal
}
