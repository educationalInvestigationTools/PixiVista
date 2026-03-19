<script setup lang="ts">


import type {SignalVisibility} from "@/lib/signal-visualizer/presentation/PlotComponent.vue";

const props = defineProps<{
    signalsInfo: Record<string, SignalVisibility>
}>()

const emit = defineEmits<{
    (e: 'toggleChannelVisibility', signalInfo: SignalVisibility): void
}>()

function toggleShow(key: string) {
    emit("toggleChannelVisibility", {
        label: key,
        visibility: !(props.signalsInfo[key]!.visibility)
    })
}

</script>

<template>
    <span> This is the annotations panel </span>
    <li v-for="(signalInfo, key) in props.signalsInfo">
        <span> {{ signalInfo.label }}</span>
        <input type="checkbox" :checked="signalInfo.visibility" @change="toggleShow(key)">>
    </li>
</template>

<style scoped>

</style>
