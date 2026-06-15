import { onBeforeUnmount, ref, type Ref } from "vue";
import { ResizeCommand } from "@/application/commands/resizeCommand";
import type { EventMediator } from "@/utils/eventMediator";

export function useResizeObserver() {
    const resizeObserverRef = ref<ResizeObserver>()

    function bindResizeObserver(htmlContainerRef: Ref<HTMLDivElement | null>, eventMediator: EventMediator) {
        resizeObserverRef.value = new ResizeObserver(async () => {
            if (htmlContainerRef.value) {
                const rect = htmlContainerRef.value.getBoundingClientRect()
                const width = rect.width
                const height = rect.height
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
