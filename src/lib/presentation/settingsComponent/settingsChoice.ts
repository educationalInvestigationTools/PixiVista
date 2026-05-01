export type Choice<T> = {
    readonly id: string
    readonly label: string
    value: T
    format?: (arg0 : T) => string
}

export type UpdateChoice<T> = {
    readonly id: string
    readonly value : T
}

export type NumberSettingChoice = Choice<number> & {
    min: number
    max: number
}

export type BooleanUpdate = UpdateChoice<boolean>
export type NumberUpdate = UpdateChoice<number>

export type AnyChoice = Choice<boolean> | NumberSettingChoice
export type AnyUpdateChoice = UpdateChoice<boolean> | UpdateChoice<number>
