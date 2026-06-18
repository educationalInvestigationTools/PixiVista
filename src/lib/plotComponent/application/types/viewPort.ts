export class ViewPort {
    startSeconds: number
    lengthSeconds: number

    constructor(startSeconds: number, lengthSeconds: number) {
        this.startSeconds = startSeconds
        this.lengthSeconds = lengthSeconds
    }

    static equal(a: ViewPort, b: ViewPort) {
        return Math.abs(a.lengthSeconds - b.lengthSeconds) <= 1e-10 && Math.abs(a.startSeconds - a.lengthSeconds) <= 1e-10
    }
}
