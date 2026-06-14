import { onBeforeUnmount, type Ref } from "vue"

const ZOOM_SENSITIVITY = 0.001

export function useWheelForZoom(htmlContainerRef: Ref<HTMLDivElement | null>, callback: (zoomFactor: number) => void) {

    const wheelListenerOptions: AddEventListenerOptions = { passive: false }
    /*
    The passive option in addEventListener is a boolean that tells the browser whether your event handler will ever call event.preventDefault().
    */

    function handleCanvasWheel(event: WheelEvent) {

        if (event.ctrlKey) {
            return
        }

        const canScroll = document.documentElement.scrollHeight > window.innerHeight
        if (!canScroll) {
            event.preventDefault()
            const factor = Math.exp(-event.deltaY * ZOOM_SENSITIVITY)
            callback(factor)
        }
    }

    if (htmlContainerRef.value !== null) {
        htmlContainerRef.value.addEventListener('wheel', handleCanvasWheel, wheelListenerOptions)
    }

    onBeforeUnmount(() => {
        if (htmlContainerRef.value) {
            htmlContainerRef.value.removeEventListener('wheel', handleCanvasWheel, wheelListenerOptions)
        }
    })
}
