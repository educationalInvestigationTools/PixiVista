import { onBeforeUnmount, type Ref } from "vue"

export function useWheelForZoom(htmlContainerRef: Ref<HTMLDivElement | null>, callback: (zoomFactor: number) => void) {

    const wheelListenerOptions: AddEventListenerOptions = { passive: false }

    function handleCanvasWheel(event: WheelEvent) {
        const canScroll = document.documentElement.scrollHeight > window.innerHeight
        if (!canScroll) {
            event.preventDefault()
            const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1
            callback(zoomFactor)
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
