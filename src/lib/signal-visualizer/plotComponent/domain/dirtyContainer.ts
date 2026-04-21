import { UpdateChannelsStateObserver } from '@/lib/signal-visualizer/plotComponent/domain/updateChannelsStateObserver.ts'
import { SignalSourceManager } from '@/lib/signal-visualizer/plotComponent/application/interfaces/signalSource.ts'
import { RenderManager } from '../../core/rendering/renderManager.ts'
import type { ViewPort } from '../application/types/viewPort.ts'
import { EventMediator } from '../../utils/eventMediator.ts'
import { DataManagerWorker } from '@/lib/signal-visualizer/plotComponent/domain/dataManager/dataManagerWorker.ts'
import { ComponentLayerLogicApi } from '@/lib/signal-visualizer/plotComponent/domain/componentLayerApi.ts'

export class DirtyContainer {
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
        const sizeData = renderer.sizeData
        const labels = signalsSourceGroup.allSignalsBuildData.map((x) => x.label)
        const componentLayerApi = new ComponentLayerLogicApi(
            sizeData,
            labels,
            viewPort,
            this.eventMediator,
        )

        await renderer.init(componentLayerApi.Component)
        const dataManagerWorker = new DataManagerWorker(workerCallback, signalsSourceGroup)
        this.updateChannelsStateObserver = new UpdateChannelsStateObserver(
            renderer,
            dataManagerWorker,
            componentLayerApi,
        )
        await this.updateChannelsStateObserver.init()
    }

    async destroy() {}
}
