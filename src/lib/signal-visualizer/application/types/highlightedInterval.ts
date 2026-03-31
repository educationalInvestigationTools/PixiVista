type DrawingStyle = 'borders' | 'background-rectangle' | 'color-signal'

export type HighlightedInterval = {
    startSeconds: number
    endSeconds: number
    label: string
    signalsAssociated: string[]
    groupLabel: string
    drawingColor: string
    drawingStyle: DrawingStyle
    hoverInfo: Record<string, string>
}

export type Group = {
    label: string
}
