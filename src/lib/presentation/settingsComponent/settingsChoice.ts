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

export type StringSettingChoice = Choice<string> & {
    options: string[]
}

export type BooleanUpdate = UpdateChoice<boolean>
export type NumberUpdate = UpdateChoice<number>
export type StringUpdate = UpdateChoice<string>

export type AnyChoice = Choice<boolean> | NumberSettingChoice | StringSettingChoice
export type AnyUpdateChoice = UpdateChoice<boolean> | UpdateChoice<number> | UpdateChoice<string>
