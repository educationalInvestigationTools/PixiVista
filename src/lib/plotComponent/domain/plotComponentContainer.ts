import { RenderManager } from "@/core/rendering/renderManager"
import { ChangeViewPortCommand, ChangeViewPortCommandEventLabel } from "@/plotComponent/application/commands/changeViewPortCommand"
import type { SignalSourceManager } from "@/plotComponent/application/interfaces/signalSource"
import { DataManagerWorker } from "@/plotComponent/domain/dataManager/dataManagerWorker"
import { ComponentLayerLogicApi } from "@/plotComponent/domain/plotComponentLayerApi"
import { PlotState } from "@/plotComponent/domain/plotState"
import { UpdateChannelsStateObserver } from "@/plotComponent/domain/updateChannelsStateObserver"
import { EventMediator } from "@/utils/eventMediator"


export class PlotComponentContainer {
    private updateChannelsStateObserver?: UpdateChannelsStateObserver
    readonly eventMediator: EventMediator

    constructor() {
        this.eventMediator = new EventMediator()
    }

    async init(
        htmlElement: HTMLElement,
        signalsSourceGroup: SignalSourceManager,
        workerCallback: () => Worker,
    ) {
        const renderer = new RenderManager(htmlElement, this.eventMediator)
        const labels = signalsSourceGroup.allSignalsBuildData.map((x) => x.label)
        const componentLayerApi = new ComponentLayerLogicApi(
            labels,
            this.eventMediator,
        )
        const dataManagerWorker = new DataManagerWorker(workerCallback, signalsSourceGroup)
        const plotState = new PlotState(dataManagerWorker)
        this.eventMediator.addHandler<ChangeViewPortCommand>(ChangeViewPortCommandEventLabel, async (command) => await plotState.changeViewPort(command.viewPort))
        await renderer.init(componentLayerApi.Component)

        const target = htmlElement.querySelector('canvas')
        target!.style.touchAction = 'pan-y'

        this.updateChannelsStateObserver = new UpdateChannelsStateObserver(
            plotState,
            renderer,
            componentLayerApi,
        )
        await this.updateChannelsStateObserver.init()
    }

    async destroy() { }
}
