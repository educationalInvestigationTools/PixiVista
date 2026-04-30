import { onBeforeUnmount, type Ref } from "vue"

export function useWheelForZoom(htmlContainerRef: Ref<HTMLDivElement | null>, callback: (zoomFactor: number) => void) {

    function handleCanvasWheel(event: WheelEvent) {
        const canScroll = document.documentElement.scrollHeight > window.innerHeight
        if (!canScroll) {
            event.preventDefault()
            const zoomFactor = event.deltaY > 0 ? 1.1 : 0.9
            callback(zoomFactor)
        }
    }

    if (htmlContainerRef.value !== null) {
        htmlContainerRef.value.addEventListener('wheel', handleCanvasWheel)
    }

    onBeforeUnmount(() => {
        if (htmlContainerRef.value) {
            htmlContainerRef.value.removeEventListener('wheel', handleCanvasWheel)
        }
    })
}
