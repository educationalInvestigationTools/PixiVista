import { Container } from 'pixi.js'
import type { SizeData } from '../../core/size-data.ts'

export abstract class Layer {
    protected _sizeData: SizeData
    container: Container

    protected constructor(sizeData: SizeData) {
        this._sizeData = sizeData
        this.container = new Container()
    }

    setSize(sizeData: SizeData) {
        this._sizeData = sizeData
        this.customSetSize()
    }

    abstract customSetSize(): void
    abstract draw(x: number, y: number): Promise<void>
}
