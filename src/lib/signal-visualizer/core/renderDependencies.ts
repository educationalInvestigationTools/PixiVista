import { areEqualViewPort, type ViewPort } from "../application/types/viewPort"
import { sameSet } from "../utils/utils"

export class RenderDependencies {
    viewPort: ViewPort
    visibleChannels: string[]
    expectedWidth: number

    constructor(viewPort: ViewPort, visibleChannels: string[], expectedWidth: number) {
        this.viewPort = viewPort
        this.visibleChannels = visibleChannels
        this.expectedWidth = expectedWidth
    }

    static equal(a: RenderDependencies, b: RenderDependencies) {
        return (
            sameSet<string>(a.visibleChannels, b.visibleChannels) &&
            areEqualViewPort(a.viewPort, b.viewPort) &&
            a.expectedWidth === b.expectedWidth
        )
    }

    static clone(a: RenderDependencies) {
        return new RenderDependencies({
            startSeconds: a.viewPort.startSeconds,
            lengthSeconds: a.viewPort.lengthSeconds,
        }, a.visibleChannels, a.expectedWidth)
    }
}
