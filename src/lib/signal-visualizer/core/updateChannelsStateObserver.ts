import type { OneDimNormalizedSignal } from '@/lib/signal-visualizer/core/types.ts'
import { RenderManager } from '@/lib/signal-visualizer/core/rendering/renderManager'
import type { DataManager } from './dataManager/dataManager'
import { RenderDependencies } from './renderDependencies'
import { Observer } from './observer'
import type { ComponentLayerLogicApi } from '../infrastructure/rendering/componentLayer/componentLayerApi'

export class UpdateChannelsStateObserver extends Observer<RenderDependencies> {
    private readonly renderManager: RenderManager
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
        this.renderManager = renderManager
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
