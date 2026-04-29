import { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { GridData } from '@/lib/signal-visualizer/plotComponent/application/types/gridData.ts'
export class GridBaseLayout extends LayoutDesign {
    protected gridData: GridData

    get horizontalDivisions(): number {
        return this.gridData.horizontalDivisions
    }

    get verticalDivisions(): number {
        return this.gridData.verticalDivisions
    }



    constructor(gridData: GridData) {
        super()
        this.gridData = gridData
    }
}
