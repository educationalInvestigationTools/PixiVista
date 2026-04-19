import type { OneDimNormalizedSignal } from '@/lib/signal-visualizer/core/types.ts'
import { RenderManager } from '@/lib/signal-visualizer/core/renderManager.ts'
import type { DataManager } from './dataManager/dataManager'
import { RenderDependencies } from './renderDependencies'
import { Observer } from './observer'



export class UpdateChannelsStateObserver extends Observer<RenderDependencies> {
    private renderManager: RenderManager
    private dataManager: DataManager

    constructor(renderManager: RenderManager, dataManager: DataManager) {
        super(
            RenderDependencies.equal,
            RenderDependencies.clone,
            () => renderManager.CurrentRenderDependencies,
        )
        this.renderManager = renderManager
        this.dataManager = dataManager
    }
    async init() {
        await super.init()
    }

    async destroy(): Promise<void> {
        this.renderManager.destroy()
    }

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
        await this.renderManager.updateSignalData(updatedData)
    }
}
