import type { OneDimNormalizedSignal } from '@/lib/signal-visualizer/core/types.ts'
import {
    RenderManager,
} from '@/lib/signal-visualizer/core/renderManager.ts'
import type { DataManager } from './dataManager/dataManager'
import {RenderDependencies } from './renderDependencies'

export class RendererObserver {
    private renderManager: RenderManager
    private dataManager: DataManager
    private lastRenderedData: RenderDependencies | null = null
    private readonly debouncedRefreshRate = 1000 / 30

    constructor(renderManager: RenderManager, dataManager: DataManager) {
        this.renderManager = renderManager
        this.dataManager = dataManager
    }
    async init() {
        setInterval(async () => {
            let flag = true
            const nextRenderData = this.renderManager.CurrentRenderDependencies
            if (this.lastRenderedData !== null) {
                if (RenderDependencies.equal(this.lastRenderedData, nextRenderData)) {
                    flag = false
                }
            }
            if (flag) {
                const cloned = RenderDependencies.clone(nextRenderData)
                await this.updateChannelsState(cloned)
                this.lastRenderedData = cloned
            }
        }, this.debouncedRefreshRate)
    }

    async destroy(): Promise<void> {
        this.renderManager.destroy()
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
