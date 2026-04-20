import { RenderManager } from '@/lib/signal-visualizer/core/rendering/renderManager.ts'
import type { DataManager } from '@/lib/signal-visualizer/plotComponent/core/dataManager/dataManager.ts'
import { RenderDependencies } from './renderDependencies.ts'
import { Observer } from '../../core/observer.ts'
import type { ComponentLayerLogicApi } from '@/lib/signal-visualizer/plotComponent/core/componentLayerApi.ts'
import type { OneDimNormalizedSignal } from '@/lib/signal-visualizer/plotComponent/application/types/oneDimNormalizedSignal.ts'

export class UpdateChannelsStateObserver extends Observer<RenderDependencies> {
    private readonly dataManager: DataManager
    private readonly componentApi: ComponentLayerLogicApi

    constructor(
        renderManager: RenderManager,
        dataManager: DataManager,
        componentApi: ComponentLayerLogicApi,
    ) {
        super(
            RenderDependencies.equal,
            RenderDependencies.clone,
            () =>
                new RenderDependencies(
                    componentApi.ViewPort,
                    componentApi.VisibleChannels,
                    renderManager.expectedWidth,
                ),
        )
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
