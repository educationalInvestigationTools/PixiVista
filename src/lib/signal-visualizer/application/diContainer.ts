import { Interpreter } from '@/lib/signal-visualizer/core/interpreter.ts'
import {
    ResizeCommand,
    ResizeCommandEventLabel,
} from '@/lib/signal-visualizer/application/commands/resizeCommand.ts'
import {
    DestroyCommand,
    DestroyCommandEventLabel,
} from '@/lib/signal-visualizer/application/commands/destroyCommand.ts'
import { SignalSourceManager } from '@/lib/signal-visualizer/application/types/signalSource.ts'
import {
    ChangeViewPortCommand,
    ChangeViewPortCommandEventLabel,
} from '@/lib/signal-visualizer/application/commands/changeViewPortCommand.ts'
import {
    ChangeChannelVisibilityCommand,
    ChangeChannelVisibilityCommandEventLabel,
} from '@/lib/signal-visualizer/application/commands/changeChannelVisibilityCommand.ts'
import { RenderManager } from '../core/renderManager'
import type { ViewPort } from './types/viewPort'
import { EventMediator } from '../utils/eventMediator'

export class DiContainer {
    private readonly interpreter: Interpreter
    readonly eventMediator : EventMediator

    constructor(
        htmlElement: HTMLElement,
        viewPort: ViewPort,
        signalsSourceGroup: SignalSourceManager,
        workerCallback: () => Worker,
    ) {
        const canvas = document.createElement('canvas')
        canvas.style.height = '100%'
        canvas.style.width = '100%'
        canvas.style.display = 'block'
        htmlElement.appendChild(canvas)
        this.eventMediator = new EventMediator()
        const renderer = new RenderManager(canvas, this.eventMediator)
        this.interpreter = new Interpreter(renderer, viewPort, signalsSourceGroup, workerCallback)

        this.eventMediator.addHandler<ChangeChannelVisibilityCommand>(
            ChangeChannelVisibilityCommandEventLabel,
            async (command) => this.interpreter.changeChannelVisibility(command),
        )

        this.eventMediator.addHandler<ChangeViewPortCommand>(
            ChangeViewPortCommandEventLabel,
            async (command) => this.interpreter.changeViewPort(command),
        )

        this.eventMediator.addHandler<DestroyCommand>(
            DestroyCommandEventLabel,
            async () => this.interpreter.destroy(),
        )

        this.eventMediator.addHandler<ResizeCommand>(
            ResizeCommandEventLabel,
            async (command) => this.interpreter.resize(command),
        )
    }
    async init() {
        await this.interpreter.init()
    }
}
