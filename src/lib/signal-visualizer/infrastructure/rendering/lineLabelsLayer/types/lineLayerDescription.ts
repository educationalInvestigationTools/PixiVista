import type { TextAlignments } from '../../labelsLayer/types/types.ts'

export type LineLayerDescription = {
    positionsNormalized: number[] // 0 <= xi <= 1, sorted, sum xi = 1
    orientation: 'horizontal' | 'vertical'
    alignmentCallback: (index: number, length: number) => TextAlignments
}
