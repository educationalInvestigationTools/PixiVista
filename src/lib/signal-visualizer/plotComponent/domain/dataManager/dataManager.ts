import type { ViewPort } from '@/lib/signal-visualizer/plotComponent/application/types/viewPort.ts'

import type { OneDimNormalizedSignal } from '@/lib/signal-visualizer/plotComponent/application/types/oneDimNormalizedSignal.ts'

export abstract class DataManager {
    abstract fetchData(
        labels: string[],
        viewPort: ViewPort,
        expectedWidth: number,
    ): Promise<OneDimNormalizedSignal[]>
}
