import type { DrawingStyle } from '@/plotComponent/application/types/highlightedInterval'
import type { TreeNodeLike } from '@/presentation/tree/treeNode'

export type AnnotationShape = 'rectangle' | 'dashed-lines'

export type Color = string

export type AnnotationStyle = {
    color: Color
    drawingStyle: DrawingStyle
    shape: AnnotationShape
}

export type AnnotationState = {
    visibility: boolean
}

export interface AnnotationNode extends TreeNodeLike<AnnotationNode> {
    id: string
    label: string
    children: AnnotationNode[]
    style: AnnotationStyle
    state: AnnotationState
}

export type AnnotationVisibilityChange = {
    ids: string[]
    visibility: boolean
}

export type AnnotationColorChange = {
    ids: string[]
    color: Color
}

export type AnnotationShapeChange = {
    ids: string[]
    shape: AnnotationShape
}
