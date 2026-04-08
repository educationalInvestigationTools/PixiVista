import {Interpreter} from '@/lib/signal-visualizer/core/interpreter.ts'
import {ResizeCommand} from '@/lib/signal-visualizer/application/commands/resizeCommand.ts'
import {DestroyCommand} from '@/lib/signal-visualizer/application/commands/destroyCommand.ts'
import {type SignalSourceBuildData} from '@/lib/signal-visualizer/application/types/signalSource.ts'
import {
    ChangeViewPortCommand
} from '@/lib/signal-visualizer/application/commands/changeViewPortCommand.ts'
import {
    ChangeChannelVisibilityCommand
} from '@/lib/signal-visualizer/application/commands/changeChannelVisibilityCommand.ts'
import type {
    PerformanceMetrics
} from '@/lib/signal-visualizer/application/types/performanceMetrics.ts'
import type {EventMediator} from '@/lib/signal-visualizer/utils/eventMediator.ts'
import {RenderManager} from '../core/renderManager'
import {ViewPort} from '@/lib/signal-visualizer/application/types/viewPort.ts'

export class DiContainer {
    private readonly interpreter: Interpreter
    public readonly resizeHandler: ResizeCommand
    public readonly destroyHandler: DestroyCommand
    public readonly changeViewPortHandler: ChangeViewPortCommand
    public readonly changeChannelVisibilityHandler: ChangeChannelVisibilityCommand

    constructor(
        htmlElement: HTMLElement,
        viewPort: ViewPort,
        signalsSource: SignalSourceBuildData[],
        eventMediator: EventMediator<PerformanceMetrics>,
    ) {
        const canvas = document.createElement('canvas')
        canvas.style.height = '100%'
        canvas.style.width = '100%'
        canvas.style.display = 'block'
        htmlElement.appendChild(canvas)
        const renderer = new RenderManager(canvas, eventMediator)
        this.interpreter = new Interpreter(renderer, viewPort, signalsSource)
        this.resizeHandler = new ResizeCommand(this.interpreter)
        this.destroyHandler = new DestroyCommand(this.interpreter)
        this.changeViewPortHandler = new ChangeViewPortCommand(this.interpreter)
        this.changeChannelVisibilityHandler = new ChangeChannelVisibilityCommand(this.interpreter)
    }

    async init() {
        await this.interpreter.init()
    }
}
