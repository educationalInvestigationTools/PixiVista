import {Interpreter} from '@/lib/signal-visualizer/core/interpreter.ts'
import {ResizeCommand} from '@/lib/signal-visualizer/application/commands/resizeCommand.ts'
import {DestroyCommand} from '@/lib/signal-visualizer/application/commands/destroyCommand.ts'
import {type SignalSource, ViewPort} from '@/lib/signal-visualizer/application/signalSource.ts'
import {
    UpdateViewPortCommand
} from '@/lib/signal-visualizer/application/commands/updateViewPortCommand.ts'
import {
    ChangeViewPortCommand
} from '@/lib/signal-visualizer/application/commands/changeViewPortCommand.ts'
import {
    ChangeChannelVisibilityCommand
} from '@/lib/signal-visualizer/application/commands/changeChannelVisibilityCommand.ts'
import type {PerformanceMetrics} from '@/lib/signal-visualizer/application/types.ts'
import type {EventMediator} from '@/lib/signal-visualizer/utils/eventMediator.ts'

export class DiContainer {
    private readonly interpreter: Interpreter
    public readonly resizeHandler: ResizeCommand
    public readonly destroyHandler: DestroyCommand
    public readonly updateViewPortHandler: UpdateViewPortCommand
    public readonly changeViewPortHandler: ChangeViewPortCommand
    public readonly changeChannelVisibilityHandler: ChangeChannelVisibilityCommand

    constructor(
        htmlElement: HTMLElement,
        viewPort: ViewPort,
        signalsSource: SignalSource[],
        eventMediator: EventMediator<PerformanceMetrics>,
    ) {
        this.interpreter = new Interpreter(htmlElement, viewPort, signalsSource, eventMediator)
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
