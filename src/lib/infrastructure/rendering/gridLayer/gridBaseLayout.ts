import { LayoutDesign } from "@/core/rendering/layoutDesign"
import type { GridData } from "@/plotComponent/application/types/gridData"

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
