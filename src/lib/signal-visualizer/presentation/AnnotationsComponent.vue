<script setup lang="ts">


import type { ChannelVisibility } from "@/lib/signal-visualizer/presentation/PlotComponent.vue";
const props = defineProps<{
    signalsInfo: Record<string, ChannelVisibility>
}>()

const emit = defineEmits<{
    (e: 'toggleChannelVisibility', signalInfo: ChannelVisibility): void
}>()

function toggleShow(key: string) {
    emit("toggleChannelVisibility", {
        label: key,
        visibility: !(props.signalsInfo[key]!.visibility)
    })
}

</script>

<template>
    <div class="flex flex-col border border-gray-900 rounded p-2">
        <span> Annotations panel: </span>
        <div>
            <span class="inline-block px-0.5" v-for="(signalInfo, key) in props.signalsInfo" :key="key">
                <span> {{ signalInfo.label }}</span>
                <input type="checkbox" :checked="signalInfo.visibility" @change="toggleShow(key)">
            </span>
        </div>
    </div>
</template>

<style scoped></style>
