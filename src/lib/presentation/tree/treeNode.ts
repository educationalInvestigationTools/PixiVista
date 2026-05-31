export interface TreeNodeLike<T extends TreeNodeLike<T>> {
    id: string
    children: T[]
}
