import {Interpreter} from "@/lib/signal-visualizer/core/Interpreter.ts";
import {ResizeCommand} from "@/lib/signal-visualizer/application/Commands/ResizeCommand.ts";
import {DestroyCommand} from "@/lib/signal-visualizer/application/Commands/DestroyCommand.ts";
import {type CompatibleSignal, ViewPort} from "@/lib/signal-visualizer/application/SignalSource.ts";
import {
    UpdateViewPortCommand
} from "@/lib/signal-visualizer/application/Commands/UpdateViewPortCommand.ts";
import {
    ChangeViewPortCommand
} from "@/lib/signal-visualizer/application/Commands/ChangeViewPortCommand.ts";
import {
    ChangeChannelVisibilityCommand
} from "@/lib/signal-visualizer/application/Commands/ChangeChannelVisibilityCommand.ts";

export class DIContainer {
    private readonly interpreter: Interpreter

    public readonly resizeHandler: ResizeCommand
    public readonly destroyHandler: DestroyCommand
    public readonly updateViewPortHandler: UpdateViewPortCommand
    public readonly changeViewPortHandler: ChangeViewPortCommand
    public readonly changeChannelVisibilityHandler: ChangeChannelVisibilityCommand

    constructor(htmlElement: HTMLElement, viewPort: ViewPort, signalsSource: CompatibleSignal[]) {
        this.interpreter = new Interpreter(htmlElement, viewPort, signalsSource)
        this.resizeHandler = new ResizeCommand(this.interpreter)
        this.destroyHandler = new DestroyCommand(this.interpreter)
        this.updateViewPortHandler = new UpdateViewPortCommand(this.interpreter)
        this.changeViewPortHandler = new ChangeViewPortCommand(this.interpreter)
        this.changeChannelVisibilityHandler = new ChangeChannelVisibilityCommand(this.interpreter)
    }

    async init() {
        await this.interpreter.init()
    }
}
