export class RenderModel {
    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}

export interface Renderer {
    readonly canvas: HTMLCanvasElement;

    draw(model: Readonly<RenderModel>): Promise<void>;

    destroy(): void;
}
