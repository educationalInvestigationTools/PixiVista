import { ViewPort } from "../application/types/viewPort";

export class PlotState {
    private viewPort: ViewPort

    get ViewPort() {
        return this.viewPort
    }

    constructor() {
        this.viewPort = new ViewPort(0, 10)
    }

    async changeViewPort(viewPort : ViewPort): Promise<void> {
        this.viewPort = viewPort
    }
}
