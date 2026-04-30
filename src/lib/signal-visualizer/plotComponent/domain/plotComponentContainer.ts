import { UpdateChannelsStateObserver } from '@/lib/signal-visualizer/plotComponent/domain/updateChannelsStateObserver.ts'
import { SignalSourceManager } from '@/lib/signal-visualizer/plotComponent/application/interfaces/signalSource.ts'
import { RenderManager } from '../../core/rendering/renderManager.ts'
import type { ViewPort } from '@/lib/signal-visualizer'
import { EventMediator } from '../../utils/eventMediator.ts'
import { DataManagerWorker } from '@/lib/signal-visualizer/plotComponent/domain/dataManager/dataManagerWorker.ts'
import { ComponentLayerLogicApi } from '@/lib/signal-visualizer/plotComponent/domain/plotComponentLayerApi.ts'
import { PlotState } from './plotState.ts'
import { ChangeViewPortCommandEventLabel, type ChangeViewPortCommand } from '../application/commands/changeViewPortCommand.ts'

export class PlotComponentContainer {
    private updateChannelsStateObserver?: UpdateChannelsStateObserver
    readonly eventMediator: EventMediator

    constructor() {
        this.eventMediator = new EventMediator()
    }

    async init(
        htmlElement: HTMLElement,
        viewPort: ViewPort,
        signalsSourceGroup: SignalSourceManager,
        workerCallback: () => Worker,
    ) {
        const renderer = new RenderManager(htmlElement, this.eventMediator)
        const labels = signalsSourceGroup.allSignalsBuildData.map((x) => x.label)
        const componentLayerApi = new ComponentLayerLogicApi(
            labels,
            this.eventMediator,
        )
        const plotState = new PlotState(viewPort)
        this.eventMediator.addHandler<ChangeViewPortCommand>(ChangeViewPortCommandEventLabel, async (command) => await plotState.changeViewPort(command.viewPort))
        await renderer.init(componentLayerApi.Component)

        const dataManagerWorker = new DataManagerWorker(workerCallback, signalsSourceGroup)
        this.updateChannelsStateObserver = new UpdateChannelsStateObserver(
            plotState,
            renderer,
            dataManagerWorker,
            componentLayerApi,
        )
        await this.updateChannelsStateObserver.init()
    }

    async destroy() { }
}
