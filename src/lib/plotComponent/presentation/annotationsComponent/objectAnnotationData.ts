import type { DrawingStyle } from '@/plotComponent/application/types/highlightedInterval'

export type AnnotationShape = 'rectangle' | 'dashed-lines'

export type AnnotationStyle = {
    color: string
    drawingStyle: DrawingStyle
    shape: AnnotationShape
}

export type AnnotationState = {
    visibility: boolean
}

export type AnnotationNode = {
    id: string
    label: string
    style: AnnotationStyle
    state: AnnotationState
    children?: AnnotationNode[]
}

export type AnnotationsTree = AnnotationNode[]

export type AnnotationVisibilityChange = {
    ids: string[]
    visibility: boolean
}

export type AnnotationColorChange = {
    ids: string[]
    color: string
}

export type AnnotationShapeChange = {
    ids: string[]
    shape: AnnotationShape
}
