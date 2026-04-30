import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { Point2D } from '../types/point2D'

export class LayoutDesign {
    private _sizeData: SizeData
    private _positionData: Point2D

    constructor(sizeData: SizeData = {width : 0, height : 0}, positionData: Point2D = {x : 0, y : 0}) {
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

    updatePosData(posData: Point2D) {
        this._positionData = posData
    }
}
