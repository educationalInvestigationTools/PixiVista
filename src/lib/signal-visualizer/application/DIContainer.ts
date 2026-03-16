import {PixiRenderer} from "@/lib/signal-visualizer/infrastructure/pixi-renderer.ts";
import {Interpreter} from "@/lib/signal-visualizer/core/Interpreter.ts";
import {ResizeCommand} from "@/lib/signal-visualizer/application/Commands/ResizeCommand.ts";
import {DestroyCommand} from "@/lib/signal-visualizer/application/Commands/DestroyCommand.ts";
import type {SampledSignalSource} from "@/lib/signal-visualizer/application/SampledSignalSource.ts";

export class DIContainer {
    private readonly interpreter: Interpreter

    public readonly resizeHandler: ResizeCommand
    public readonly destroyHandler: DestroyCommand

    constructor(htmlElement: HTMLElement, signalsSource : SampledSignalSource) {
        const renderer = new PixiRenderer()
        this.interpreter = new Interpreter(renderer, htmlElement, signalsSource)
        this.resizeHandler = new ResizeCommand(this.interpreter)
        this.destroyHandler = new DestroyCommand(this.interpreter)
    }
}
