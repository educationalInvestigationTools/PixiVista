import { onBeforeUnmount, ref, type Ref } from "vue";
import { ResizeCommand } from "../../application/commands/resizeCommand";
import type { EventMediator } from "../../utils/eventMediator";

export function useResizeObserver() {
    const resizeObserverRef = ref<ResizeObserver>()

    function bindResizeObserver(htmlContainerRef: Ref<HTMLDivElement | null>, eventMediator: EventMediator) {
        resizeObserverRef.value = new ResizeObserver(async () => {
            if (htmlContainerRef.value) {
                const width = htmlContainerRef.value.clientWidth
                const height = htmlContainerRef.value.clientHeight
                await eventMediator.publish(new ResizeCommand(width, height))
            }
        })

        if (htmlContainerRef.value) {
            resizeObserverRef.value.observe(htmlContainerRef.value)
        }
    }

    onBeforeUnmount(() => {
        resizeObserverRef.value?.disconnect()
    })

    return {
        bindResizeObserver,
    }
}
