import type { AnyChoice } from "@/presentation/settingsComponent/settingsChoice"
import type { TreeNodeLike } from "@/presentation/tree/treeNode"

export interface SettingsTreeNode extends TreeNodeLike<SettingsTreeNode> {
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
