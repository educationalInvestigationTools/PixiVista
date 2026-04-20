import type { PositionData } from '@/lib/signal-visualizer/core/types/positionData.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'

export class LayoutDesign {
    private _sizeData: SizeData
    private _positionData: PositionData

    constructor(sizeData: SizeData, positionData: PositionData) {
        this._sizeData = sizeData
        this._positionData = positionData
    }

    get height(): number {
        return this._sizeData.height
    }

    get width(): number {
        return this._sizeData.width
    }

    get x(): number {
        return this._positionData.x
    }

    get y(): number {
        return this._positionData.y
    }

    updateSizeData(sizeData: SizeData) {
        this._sizeData = sizeData
    }

    updatePosData(posData: PositionData) {
        this._positionData = posData
    }
}
