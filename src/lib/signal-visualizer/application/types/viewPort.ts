export type ViewPort = {
    startSeconds: number
    lengthSeconds: number
}

export function areEqualViewPort(a: ViewPort, b: ViewPort) {
    return a.lengthSeconds === b.lengthSeconds && b.startSeconds === a.startSeconds
}
