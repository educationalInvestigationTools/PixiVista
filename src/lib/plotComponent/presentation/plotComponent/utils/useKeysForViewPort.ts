import { onBeforeUnmount, type Ref } from "vue"

export function useKeysForViewPort(htmlContainerRef: Ref<HTMLDivElement | null>, callbackUpDown: (down: boolean) => void, callbackLeftRight: (left: boolean) => void) {


    function handleKeyDown(e: KeyboardEvent) {
        const key = e.key
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) return
        e.preventDefault()

        if (key === 'ArrowLeft' || key === 'ArrowRight') {
            callbackLeftRight(key === 'ArrowLeft')
        }

        if (key === 'ArrowUp' || key === 'ArrowDown') {
            callbackUpDown(key === 'ArrowDown')
        }
    }

    if (htmlContainerRef.value !== null) {
        htmlContainerRef.value.addEventListener('keydown', handleKeyDown)
    }

    onBeforeUnmount(() => {
        htmlContainerRef.value?.removeEventListener('keydown', handleKeyDown)
    })
}
