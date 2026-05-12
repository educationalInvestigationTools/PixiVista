import type { OneDimNormalizedSignal } from "@/plotComponent/application/types/oneDimNormalizedSignal";
import { ViewPort } from "@/plotComponent/application/types/viewPort";
import type { DataManager } from "@/plotComponent/domain/dataManager/dataManager";

export class PlotState {
    private viewPort: ViewPort
    private dataManager: DataManager

    get ViewPort() {
        return this.viewPort
    }

    constructor(dataManager: DataManager) {
        this.viewPort = new ViewPort(0, 10)
        this.dataManager = dataManager
    }

    async changeViewPort(viewPort: ViewPort): Promise<void> {
        this.viewPort = viewPort
    }

    async fetchData(
        labels: string[],
        viewPort: ViewPort,
        expectedWidth: number,
    ): Promise<OneDimNormalizedSignal[]> {
        return this.dataManager.fetchData(labels, viewPort, expectedWidth)
    }
}
