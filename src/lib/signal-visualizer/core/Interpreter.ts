import {OneDimSignals, type Renderer} from "@/lib/signal-visualizer/core/Renderer.ts";
import {RenderModel} from "@/lib/signal-visualizer/core/Renderer.ts";

export class Interpreter {
    private renderer: Renderer
    private htmlElement: HTMLElement

    constructor(renderer: Renderer, container: HTMLElement) {
        this.renderer = renderer;
        this.htmlElement = container;
        this.htmlElement.appendChild(this.renderer.canvas);
    }

    async destroy(): Promise<void> {
        this.renderer.destroy();
    }

    async resize(width: number, height: number) {
        const samples = new Float32Array([0.1, 0.2, 0.3, 0.4, 1, 2, 3, 4, 5, 6, 7])
        const values1 = new Float32Array([0.1, 0.2, 0.3, 0.4, 1, 2, 3, 4, 0.1, 0.2, 5])
        const values2 = new Float32Array([0.1, 0.2, 0.3, 0.4, 1, 2, 3, 4, 5, 6, 7])
        const channels = [values1, values2]
        await this.renderer.draw(new RenderModel(width, height, new OneDimSignals(
            samples, channels
        )));
    }
}
