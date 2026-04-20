export class ViewPort {
    startSeconds: number
    lengthSeconds: number

    constructor(startSeconds: number, lengthSeconds: number) {
        this.startSeconds = startSeconds
        this.lengthSeconds = lengthSeconds
    }

    static equal(a: ViewPort, b: ViewPort) {
        return a.lengthSeconds === b.lengthSeconds && b.startSeconds === a.startSeconds
    }
}
