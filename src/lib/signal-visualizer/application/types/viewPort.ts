export class ViewPort {
    startSeconds: number
    readonly lengthSeconds: number

    constructor(startSeconds: number, lengthSeconds: number) {
        this.startSeconds = startSeconds
        this.lengthSeconds = lengthSeconds
    }

    updateStartSeconds(startSeconds: number) {
        this.startSeconds = startSeconds
    }
}
