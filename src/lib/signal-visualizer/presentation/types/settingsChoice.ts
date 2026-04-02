export type BaseSettingChoice = {
    id: string
    label: string
}

export type BooleanSettingChoice = BaseSettingChoice & {
    kind: 'boolean'
    value: boolean
}

export type NumberSettingChoice = BaseSettingChoice & {
    kind: 'number'
    value: number
    min: number
    max: number
    step?: number
}

export type SettingChoice = BooleanSettingChoice | NumberSettingChoice

export type SettingChoiceUpdate = {
    id: string
    value: boolean | number
}
