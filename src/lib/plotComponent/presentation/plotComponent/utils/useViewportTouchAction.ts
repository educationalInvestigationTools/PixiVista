import { isScaledViewport } from "@/plotComponent/presentation/plotComponent/utils/isScaledViewport"
import { onBeforeUnmount, watch, type Ref } from "vue"

export function useViewportTouchAction(
    htmlElementRef: Ref<HTMLElement | null>,
) {

    function handleViewportResize() {
        if (!window.visualViewport || !htmlElementRef.value) return
        const container = htmlElementRef.value
        const target = container.querySelector('canvas')
        if (!target) return
        target.style.touchAction = isScaledViewport() ? "auto" : "pan-y"
    }

    if (typeof window !== "undefined" && window.visualViewport) {
        window.visualViewport.addEventListener("resize", handleViewportResize)
    }

    watch(htmlElementRef, (newElement) => {
        if (newElement) {
            handleViewportResize()
        }
    }, { immediate: true })

    onBeforeUnmount(() => {
        if (typeof window !== "undefined" && window.visualViewport) {
            window.visualViewport.removeEventListener("resize", handleViewportResize)
        }
    })
}
