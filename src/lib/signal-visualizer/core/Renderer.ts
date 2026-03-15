export class ChannelRenderModel {

}

export class RenderModel {
    readonly width: number;
    readonly height: number;

    readonly channels: Array<ChannelRenderModel>

    constructor(width: number, height: number, channels: Array<ChannelRenderModel>) {
        this.width = width;
        this.height = height;
        this.channels = channels;
    }
}

export interface Renderer {
    readonly canvas: HTMLCanvasElement;

    draw(model: Readonly<RenderModel>): Promise<void>;

    destroy(): void;
}
