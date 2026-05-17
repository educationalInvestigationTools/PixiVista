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

export interface SettingsTreeNode {
    id: string
    type : string
    children: SettingsTreeNode[]
}

export class ChoiceTreeNode implements SettingsTreeNode {
    readonly choice: AnyChoice

    constructor(choice: AnyChoice) {
        this.choice = choice
    }

    get type() {
        return "ChoiceTreeNode"
    }

    get id() {
        return this.choice.id
    }

    get children() {
        return []
    }
}

export class LabelTreeNode implements SettingsTreeNode {
    readonly label: string
    readonly children: SettingsTreeNode[]
    readonly id : string
    constructor(id : string, label: string, children: SettingsTreeNode[]) {
        this.label = label
        this.children = children
        this.id = id
    }

    get type() {
        return "LabelTreeNode"
    }
}
