import { RendererObserver } from '@/lib/signal-visualizer/core/rendererObserver'
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
import { DataManagerWorker } from '../core/dataManager/dataManagerWorker'

export class DirtyContainer {
    private observer?: RendererObserver
    private readonly canvas: HTMLCanvasElement
    readonly eventMediator: EventMediator

    constructor(htmlElement: HTMLElement) {
        this.canvas = document.createElement('canvas')
        this.canvas.style.height = '100%'
        this.canvas.style.width = '100%'
        this.canvas.style.display = 'block'
        htmlElement.appendChild(this.canvas)
        this.eventMediator = new EventMediator()
    }
    async init(
        viewPort: ViewPort,
        signalsSourceGroup: SignalSourceManager,
        workerCallback: () => Worker,
    ) {
        const renderer = new RenderManager(this.canvas, this.eventMediator)
        await renderer.init(
            signalsSourceGroup.allSignalsBuildData.map((x) => x.label),
            viewPort,
        )
        const dataManagerWorker = new DataManagerWorker(workerCallback, signalsSourceGroup)
        this.observer = new RendererObserver(renderer, dataManagerWorker)
        await this.observer.init()

        this.eventMediator.addHandler<ChangeChannelVisibilityCommand>(
            ChangeChannelVisibilityCommandEventLabel,
            async (command) => renderer.changeChannelVisibility(command),
        )

        this.eventMediator.addHandler<ChangeViewPortCommand>(
            ChangeViewPortCommandEventLabel,
            async (command) => renderer.changeViewPort(command),
        )

        this.eventMediator.addHandler<DestroyCommand>(DestroyCommandEventLabel, async () =>
            this.destroy(),
        )

        this.eventMediator.addHandler<ResizeCommand>(ResizeCommandEventLabel, async (command) =>
            renderer.resize(command),
        )
    }

    async destroy() {
        await this.observer?.destroy()
    }
}
