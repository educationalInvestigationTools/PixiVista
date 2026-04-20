export type DrawingStyle = 'borders' | 'background-rectangle' | 'color-signal'

export type HighlightedInterval = {
    startSeconds: number
    endSeconds: number
    label: string
    signalsAssociated: string[]
    drawingColor: string
    drawingStyle: DrawingStyle
    hoverInfo: Record<string, string>
}

export type IntervalGroup = {
    label: string
    priority: number // If a < b, then a should be draw first, then b over it, this is the rule.
    intervals: HighlightedInterval[]
}
