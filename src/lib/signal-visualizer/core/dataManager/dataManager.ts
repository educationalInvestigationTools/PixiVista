import type { ViewPort } from '../../application/types/viewPort'
import type { OneDimNormalizedSignal } from '../types'

export abstract class DataManager {
    abstract fetchData(
        labels: string[],
        viewPort: ViewPort,
        expectedWidth: number,
    ): Promise<OneDimNormalizedSignal[]>
}
