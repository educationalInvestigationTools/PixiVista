import {ChannelRenderModel, type Renderer} from "@/lib/signal-visualizer/core/Renderer.ts";
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
        await this.renderer.draw(new RenderModel(width, height, [new ChannelRenderModel()]));
    }
}
