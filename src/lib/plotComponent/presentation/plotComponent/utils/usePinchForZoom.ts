import { onBeforeUnmount, type Ref } from "vue"

type PointerPosition = {
    x: number
    y: number
}

const pinchRatioStep = 1.1
const zoomInFactor = 0.9
const zoomOutFactor = 1.1

export function usePinchForZoom(htmlContainerRef: Ref<HTMLDivElement | null>, callback: (zoomFactor: number) => void) {
    const pointers = new Map<number, PointerPosition>()
    let lastDistance: number | null = null

    function isTouchPointer(event: PointerEvent) {
        return event.pointerType === "touch"
    }

    function updatePointer(event: PointerEvent) {
        pointers.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY,
        })
    }

    function getDistance(): number | null {
        if (pointers.size < 2) {
            return null
        }
        const positions = Array.from(pointers.values())
        const first = positions[0]!
        const second = positions[1]!
        const dx = second.x - first.x
        const dy = second.y - first.y
        return Math.hypot(dx, dy)
    }

    function handlePointerDown(event: PointerEvent) {
        if (!isTouchPointer(event)) {
            return
        }
        if (pointers.size >= 2 && !pointers.has(event.pointerId)) {
            return
        }
        updatePointer(event)
        const element = htmlContainerRef.value
        if (element) {
            element.setPointerCapture(event.pointerId)
        }
        if (pointers.size === 2) {
            lastDistance = getDistance()
        }
    }

    function handlePointerMove(event: PointerEvent) {
        if (!isTouchPointer(event) || !pointers.has(event.pointerId)) {
            return
        }
        updatePointer(event)
        if (pointers.size < 2 || lastDistance === null) {
            return
        }
        const distance = getDistance()
        if (!distance || distance === 0) {
            return
        }
        const ratio = distance / lastDistance
        if (ratio >= pinchRatioStep) {
            callback(zoomInFactor)
            lastDistance = distance
            return
        }
        if (ratio <= 1 / pinchRatioStep) {
            callback(zoomOutFactor)
            lastDistance = distance
        }
    }

    function handlePointerUp(event: PointerEvent) {
        if (!isTouchPointer(event)) {
            return
        }
        pointers.delete(event.pointerId)
        const element = htmlContainerRef.value
        if (element?.hasPointerCapture(event.pointerId)) {
            element.releasePointerCapture(event.pointerId)
        }
        if (pointers.size < 2) {
            lastDistance = null
        }
    }

    if (htmlContainerRef.value !== null) {
        const element = htmlContainerRef.value
        element.addEventListener("pointerdown", handlePointerDown)
        element.addEventListener("pointermove", handlePointerMove)
        element.addEventListener("pointerup", handlePointerUp)
        element.addEventListener("pointercancel", handlePointerUp)
    }

    onBeforeUnmount(() => {
        const element = htmlContainerRef.value
        if (!element) {
            return
        }
        element.removeEventListener("pointerdown", handlePointerDown)
        element.removeEventListener("pointermove", handlePointerMove)
        element.removeEventListener("pointerup", handlePointerUp)
        element.removeEventListener("pointercancel", handlePointerUp)
    })
}
