import { onBeforeUnmount, type Ref } from 'vue'

export function useViewPortDrag(
    containerRef: Ref<HTMLElement | null>,
    onDragUpdate: (nextStartSeconds: number) => void,
    getCurrentSeconds: () => number,
    getCurrentLength: () => number,
) {
    let isDragging = false
    let initialPointerX = 0
    let initialSeconds = 0

    const el = containerRef.value
    if (el) {
        el.addEventListener('pointerdown', onPointerDown)
    }

    function onPointerDown(e: PointerEvent) {
        isDragging = true
        initialPointerX = e.clientX
        initialSeconds = getCurrentSeconds()

        window.addEventListener('pointermove', onPointerMove)
        window.addEventListener('pointerup', onPointerUp)
        window.addEventListener('pointercancel', onPointerUp)
    }

    function onPointerMove(e: PointerEvent) {
        if (!isDragging || !containerRef.value) return

        const currentX = e.clientX
        const deltaX = currentX - initialPointerX
        const containerWidth = containerRef.value.clientWidth

        if (containerWidth === 0) return
        const dragRatio = deltaX / containerWidth
        const secondsOffset = Math.round(dragRatio * getCurrentLength())
        const nextStart = initialSeconds - secondsOffset

        onDragUpdate(nextStart)
    }

    function onPointerUp() {
        isDragging = false
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerup', onPointerUp)
        window.removeEventListener('pointercancel', onPointerUp)
    }



    onBeforeUnmount(() => {
        const el = containerRef.value
        if (el) {
            el.removeEventListener('pointerdown', onPointerDown)
        }
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerup', onPointerUp)
        window.removeEventListener('pointercancel', onPointerUp)
    })
}
