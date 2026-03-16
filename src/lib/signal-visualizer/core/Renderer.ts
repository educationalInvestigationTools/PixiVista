export class OneDimSignals {
    samples: Float32Array
    channels: Float32Array[]

    constructor(samples: Float32Array, channels: Float32Array[]) {
        this.samples = samples;
        this.channels = channels;
    }
}

export type RenderModel = {
    readonly width: number;
    readonly height: number;
    readonly oneDimSignals: OneDimSignals
}

export interface Renderer {
    readonly canvas: HTMLCanvasElement;

    draw(model: Readonly<RenderModel>): Promise<void>;

    destroy(): void;
}
