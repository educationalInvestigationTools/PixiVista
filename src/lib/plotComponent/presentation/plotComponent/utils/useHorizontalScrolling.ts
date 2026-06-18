import { onBeforeUnmount, type Ref } from 'vue'
import interact from 'interactjs'
import { isScaledViewport } from '@/plotComponent/presentation/plotComponent/utils/isScaledViewport'

export function useViewPortDrag(
    containerRef: Ref<HTMLElement | null>,
    onDragUpdate: (nextStartSeconds: number) => void,
    getCurrentSeconds: () => number,
    getCurrentLength: () => number
) {
    let initialSeconds = 0

    function setup() {
        const el = containerRef.value
        if (!el) return

        interact(el).draggable({
            listeners: {
                start() {
                    initialSeconds = getCurrentSeconds()
                },
                move(event) {
                    if (!isScaledViewport()) {
                        const deltaX = event.clientX - event.clientX0
                        const containerWidth = el!.getBoundingClientRect().width
                        if (containerWidth === 0) return
                        const dragRatio = deltaX / containerWidth
                        const secondsOffset = dragRatio * getCurrentLength()
                        onDragUpdate(initialSeconds - secondsOffset)
                    }
                }
            }
        })
    }

    function destroy() {
        const el = containerRef.value
        if (el) interact(el).unset()
    }

    setup()
    onBeforeUnmount(() => destroy())
}
