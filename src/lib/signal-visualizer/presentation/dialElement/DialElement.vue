<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
    currentValuePercent: number
    toStringFromPercent: (arg0: number) => string
}>()

const emit = defineEmits<{
    (e: 'update:value', newPercentValue: number): void
}>()

const valuePercent = computed({
    get: () => props.currentValuePercent,
    set: (v) => {
        emit('update:value', Math.min(100, Math.max(0, v)))
    },
})

const activeDialElement = ref<HTMLElement | null>(null)
const isDragging = ref(false)

function getDialPercentFromPointer(event: PointerEvent, dialElement: HTMLElement) {
    const dialRect = dialElement.getBoundingClientRect()
    const centerX = dialRect.left + dialRect.width / 2
    const centerY = dialRect.top + dialRect.height / 2
    const deltaX = event.clientX - centerX
    const deltaY = event.clientY - centerY
    const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI
    const normalizedAngle = (angle + 360 + 90) % 360
    return (normalizedAngle / 360) * 100
}

function applyDialPointer(event: PointerEvent) {
    const pointerPercent = getDialPercentFromPointer(event, activeDialElement.value!)
    valuePercent.value = pointerPercent
}

function startDialInteraction(event: PointerEvent) {
    event.preventDefault()
    activeDialElement.value = event.currentTarget as HTMLElement
    isDragging.value = true
    applyDialPointer(event)
}

function handleDialPointerMove(event: PointerEvent) {
    if (!isDragging.value || !activeDialElement.value) {
        return
    }
    applyDialPointer(event)
}

function stopDialInteraction() {
    isDragging.value = false
    activeDialElement.value = null
}

function nudgeNumberChoice(direction: -1 | 1) {
    const step = 1
    const nextValue = valuePercent.value + step * direction
    valuePercent.value = nextValue
}

function getDialStyle() {
    return {
        '--dial-fill': `${valuePercent.value}%`,
        '--dial-deg': `${(valuePercent.value / 100) * 360}deg`,
    }
}

onMounted(() => {
    window.addEventListener('pointermove', handleDialPointerMove)
    window.addEventListener('pointerup', stopDialInteraction)
    window.addEventListener('pointercancel', stopDialInteraction)
})

onBeforeUnmount(() => {
    window.removeEventListener('pointermove', handleDialPointerMove)
    window.removeEventListener('pointerup', stopDialInteraction)
    window.removeEventListener('pointercancel', stopDialInteraction)
})
</script>

<template>
    <div class="dial-element">
        <button class="dial-button" :style="getDialStyle()" type="button" role="slider" aria-valuemin="0"
            aria-valuemax="100" :aria-valuenow="Math.round(valuePercent)" @pointerdown="startDialInteraction($event)"
            @keydown.left.prevent="nudgeNumberChoice(-1)" @keydown.down.prevent="nudgeNumberChoice(-1)"
            @keydown.right.prevent="nudgeNumberChoice(1)" @keydown.up.prevent="nudgeNumberChoice(1)"></button>
        <div class="dial-labels">
            <span>{{ Math.round(valuePercent) }}% </span>
            <span>{{ props.toStringFromPercent(valuePercent) }}</span>
        </div>

    </div>
</template>

<style scoped>

.dial-labels {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: white;
    gap: 10px;
}


.dial-element {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    padding: 4px;
        gap: 10px;
}

.dial-button {
    width: 40px;
    aspect-ratio: 1;
    --track: #ffffff;
    --accent: #06b6d4;
    border-radius: 50%;
    background: conic-gradient(var(--accent) var(--dial-fill), var(--track) 0deg);
    cursor: pointer;
}
</style>
