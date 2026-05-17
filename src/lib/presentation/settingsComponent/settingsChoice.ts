export type Choice<T> = {
    readonly id: string
    readonly label: string
    value: T
    readonly format?: (arg0: T) => string
}

export type UpdateChoice<T> = {
    readonly id: string
    readonly value: T
}

export type NumberSettingChoice = Choice<number> & {
    readonly min: number
    readonly max: number
}

export type StringSettingChoice = Choice<string> & {
    readonly options: string[]
}

export type BooleanUpdate = UpdateChoice<boolean>
export type NumberUpdate = UpdateChoice<number>
export type StringUpdate = UpdateChoice<string>

export type AnyChoice = Choice<boolean> | NumberSettingChoice | StringSettingChoice
export type AnyUpdateChoice = UpdateChoice<boolean> | UpdateChoice<number> | UpdateChoice<string>
