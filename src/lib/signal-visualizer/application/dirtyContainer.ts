import { UpdateChannelsStateObserver } from '@/lib/signal-visualizer/core/updateChannelsStateObserver'
import { SignalSourceManager } from '@/lib/signal-visualizer/application/types/signalSource.ts'
import { RenderManager } from '../core/rendering/renderManager'
import type { ViewPort } from './types/viewPort'
import { EventMediator } from '../utils/eventMediator'
import { DataManagerWorker } from '../core/dataManager/dataManagerWorker'
import { ComponentLayerLogicApi } from '../infrastructure/rendering/componentLayer/componentLayerApi'

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
