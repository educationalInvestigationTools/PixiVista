import type { TreeNodeLike } from '@/presentation/tree/treeNode'

export type AnnotationShape = 'rectangle' | 'dashed-lines'
export type Color = string
export type Visibility = boolean

export abstract class AnnotationProperty<T> {
    readonly type: string
    value: T
    constructor(type: string, value: T) {
        this.type = type
        this.value = value
    }

    get Value() {
        return this.value
    }

    set Value(value: T) {
        this.value = value
    }
}

export class ColorProperty extends AnnotationProperty<Color> {
    constructor(color: Color) {
        super("color", color)
    }
}

export class ShapeProperty extends AnnotationProperty<AnnotationShape> {
    constructor(shape: AnnotationShape) {
        super("shape", shape)
    }
}

export class VisibilityProperty extends AnnotationProperty<Visibility> {
    constructor(visibility: Visibility) {
        super('visibility', visibility)
    }
}

export type ImplementedProperties = Color | AnnotationShape | Visibility

export abstract class AnnotationNode implements TreeNodeLike<AnnotationNode> {
    readonly id: string
    readonly label: string
    readonly children: AnnotationNode[]
    readonly visibility: VisibilityProperty = new VisibilityProperty(true)

    constructor(id: string, label: string, children: AnnotationNode[]) {
        this.id = id
        this.label = label
        this.children = children
    }

    abstract getProperties(): ReadonlyMap<string, AnnotationProperty<ImplementedProperties>>
    abstract updateProperty(propertyId: string, value : ImplementedProperties): void
    abstract updateVisibility(visibility : Visibility): void
}
