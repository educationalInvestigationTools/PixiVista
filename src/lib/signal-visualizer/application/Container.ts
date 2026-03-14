import type {Renderer} from "@/lib/signal-visualizer/core/Renderer.ts";
import {RenderModel} from "@/lib/signal-visualizer/core/Renderer.ts";

export class Container {
    renderer: Renderer
    container: HTMLElement

    constructor(renderer: Renderer, container: HTMLElement) {
        this.renderer = renderer;
        this.container = container;
        this.container.appendChild(this.renderer.canvas);
    }

    async resize(width: number, height: number) {
        await this.renderer.draw(new RenderModel(width, height));
    }
}
