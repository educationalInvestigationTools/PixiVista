export type SettingChoice<T> = {
    id: string
    label: string
    value: T
}

export type BooleanSettingChoice = SettingChoice<boolean>
export type NumberSettingChoice = SettingChoice<number> & {
    min: number
    max: number
    step?: number
}

export type AnySettingChoice = BooleanSettingChoice | NumberSettingChoice

export type UpdateFor<T> = T extends SettingChoice<infer V> ? { id: string; value: V } : never

export type AnySettingChoiceUpdate = UpdateFor<AnySettingChoice>
