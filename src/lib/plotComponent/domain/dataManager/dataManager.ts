import type { OneDimNormalizedSignal } from "@/plotComponent/application/types/oneDimNormalizedSignal";
import type { ViewPort } from "@/plotComponent/application/types/viewPort";

export abstract class DataManager {
    abstract fetchData(
        labels: string[],
        viewPort: ViewPort,
        expectedWidth: number,
    ): Promise<OneDimNormalizedSignal[]>
}
