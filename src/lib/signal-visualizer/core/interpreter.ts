import type { OneDimNormalizedSignal } from '@/lib/signal-visualizer/core/types.ts'
import {
    areEqual,
    clone,
    RenderManager,
    type ReactiveRenderModel,
} from '@/lib/signal-visualizer/core/renderManager.ts'
import { DataManagerWorker } from './dataManager/dataManagerWorker'

export class Interpreter {
    private renderManager: RenderManager
    private dataManager: DataManagerWorker
    private lastRenderedData: ReactiveRenderModel | null = null
    private readonly debouncedRefreshRate = 1000 / 30

    constructor(renderManager: RenderManager, dataManager: DataManagerWorker) {
        this.renderManager = renderManager
        this.dataManager = dataManager
    }
    async init() {
        setInterval(async () => {
            let flag = true
            const nextRenderData = this.renderManager.CurrentRenderModel
            if (this.lastRenderedData !== null) {
                if (areEqual(this.lastRenderedData, nextRenderData)) {
                    flag = false
                }
            }
            if (flag) {
                const cloned = clone(nextRenderData)
                await this.updateChannelsState(cloned)
                this.lastRenderedData = cloned
            }
        }, this.debouncedRefreshRate)
    }

    async destroy(): Promise<void> {
        this.renderManager.destroy()
    }

    async updateChannelsState(dataToRender: ReactiveRenderModel): Promise<void> {
        const viewPort = dataToRender.viewPort
        const activeChannels = dataToRender.visibleChannels
        const expectedWidth = dataToRender.expectedWidth
        const updatedData: OneDimNormalizedSignal[] = await this.dataManager.fetchData(
            activeChannels,
            viewPort,
            expectedWidth,
        )
        await this.renderManager.render(updatedData)
    }
}
