import { onBeforeUnmount, ref, type Ref } from "vue";
import { ResizeCommand } from "../../application/commands/resizeCommand";
import type { EventMediator } from "../../utils/eventMediator";

export function useResizeObserver(htmlContainerRef : Ref<HTMLDivElement | null>, eventMediator : EventMediator) {
    const resizeObserverRef = ref<ResizeObserver>()


    resizeObserverRef.value = new ResizeObserver(async () => {
        if (htmlContainerRef.value) {
            const width = htmlContainerRef.value.clientWidth
            const height = htmlContainerRef.value.clientHeight
            await eventMediator.publish(new ResizeCommand(width, height))
        }
    })
    resizeObserverRef.value.observe(htmlContainerRef.value!)

    onBeforeUnmount(() => {
        resizeObserverRef.value?.disconnect()
    })
}
