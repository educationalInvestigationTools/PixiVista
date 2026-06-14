export function isScaledViewport(): boolean {
    if (!window.visualViewport) return false
    const zoomed = window.visualViewport.scale > 1
    return zoomed
}
