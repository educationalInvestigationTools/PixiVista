import { onBeforeUnmount, type Ref } from "vue"
import interact from "interactjs"

const pinchRatioStep = 1.1
const zoomInFactor = 0.9
const zoomOutFactor = 1.1

export function usePinchForZoom(
    htmlContainerRef: Ref<HTMLDivElement | null>,
    callback: (zoomFactor: number) => void
) {
    let interactable: ReturnType<typeof interact> | null = null
    let currentScale = 1

    function setupInteract(element: HTMLDivElement | null) {
        if (interactable) {
            interactable.unset()
            interactable = null
        }

        if (!element) return

        interactable = interact(element).gesturable({
            listeners: {
                start() {
                    currentScale = 1
                },
                move(event) {
                    const ratio = event.scale / currentScale

                    if (ratio >= pinchRatioStep) {
                        callback(zoomInFactor)
                        currentScale = event.scale
                    } else if (ratio <= 1 / pinchRatioStep) {
                        callback(zoomOutFactor)
                        currentScale = event.scale
                    }
                }
            }
        })
    }
    setupInteract(htmlContainerRef.value)

    onBeforeUnmount(() => {
        if (interactable) {
            interactable.unset()
            interactable = null
        }
    })
}
