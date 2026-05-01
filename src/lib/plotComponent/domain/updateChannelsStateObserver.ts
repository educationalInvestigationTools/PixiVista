import { Observer } from "@/core/observer"
import type { RenderManager } from "@/core/rendering/renderManager"
import type { OneDimNormalizedSignal } from "@/plotComponent/application/types/oneDimNormalizedSignal"
import type { DataManager } from "@/plotComponent/domain/dataManager/dataManager"
import type { ComponentLayerLogicApi } from "@/plotComponent/domain/plotComponentLayerApi"
import type { PlotState } from "@/plotComponent/domain/plotState"
import { RenderDependencies } from "@/plotComponent/domain/renderDependencies"


export class UpdateChannelsStateObserver extends Observer<RenderDependencies> {
    private readonly dataManager: DataManager
    private readonly plotState : PlotState
    private readonly componentApi: ComponentLayerLogicApi

    constructor(
        plotState : PlotState,
        renderManager: RenderManager,
        dataManager: DataManager,
        componentApi: ComponentLayerLogicApi,
    ) {
        super(
            RenderDependencies.equal,
            RenderDependencies.clone,
            () =>
                new RenderDependencies(
                    plotState.ViewPort,
                    componentApi.VisibleChannels,
                    renderManager.expectedWidth,
                ),
        )
        this.plotState = plotState
        this.dataManager = dataManager
        this.componentApi = componentApi
    }

    async init() {
        await super.init()
    }

    async destroy(): Promise<void> {}

    async update(currentObserved: RenderDependencies): Promise<void> {
        await this.updateChannelsState(currentObserved)
    }

    async updateChannelsState(dataToRender: RenderDependencies): Promise<void> {
        const viewPort = dataToRender.viewPort
        const activeChannels = dataToRender.visibleChannels
        const expectedWidth = dataToRender.expectedWidth
        const updatedData: OneDimNormalizedSignal[] = await this.dataManager.fetchData(
            activeChannels,
            viewPort,
            expectedWidth,
        )
        await this.componentApi.updateSignalData(updatedData)
    }
}
