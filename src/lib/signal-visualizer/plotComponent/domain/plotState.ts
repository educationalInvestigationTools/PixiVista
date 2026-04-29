import { ViewPort } from "../application/types/viewPort";

export class PlotState {
    private viewPort: ViewPort

    get ViewPort() {
        return this.viewPort
    }

    constructor(viewPort: ViewPort) {
        this.viewPort = viewPort
    }

    async changeViewPort(viewPort : ViewPort): Promise<void> {
        this.viewPort = viewPort
    }
}
