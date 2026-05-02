export type Side = 'left' | 'right' | 'up' | 'down'
export type Orientation = 'horizontal' | 'vertical'


export function getOrientationGivenSide(side: Side): Orientation {
    if (side === 'left' || side === 'right') return 'vertical'
    return "horizontal"
}
