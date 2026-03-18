import { Container } from "pixi.js";
import type { SizeData } from "./size-data";



export abstract class Layer {
    protected _sizeData: SizeData
    container: Container

    constructor(sizeData: SizeData) {
        this._sizeData = sizeData
        this.container = new Container()
    }

    setSize(sizeData: SizeData) {
        this._sizeData = sizeData
        this.customSetSize()
    }

    abstract customSetSize() : void
    abstract draw(x: number, y: number): Promise<void>
}
