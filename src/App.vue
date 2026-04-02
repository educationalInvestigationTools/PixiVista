<script setup lang="ts">
import { onMounted, ref } from "vue";
import PlotComponent from "@/lib/signal-visualizer/presentation/PlotComponent.vue";
import { loadEdfSignalSourcesFromPath } from "@/lib/signal-visualizer/infrastructure/signals/edfSignalSource.ts";
import {
    type SignalSource
} from "@/lib/signal-visualizer/application/types/signalSource.ts";
import type { IntervalGroup } from "./lib/signal-visualizer/application/types/highlightedInterval";

const EDF_FILE_PATH = "/home/alvaro/Documents/Tesis/sleep-edf-database-expanded-1.0.0/sleep-cassette/SC4001E0-PSG.edf"

const signalSources = ref<SignalSource[]>([])
const isLoadingChannels = ref(true)
const loadingError = ref<string | null>(null)

const annotations: Record<string, IntervalGroup> = {}

onMounted(async () => {
    try {
        signalSources.value = await loadEdfSignalSourcesFromPath(EDF_FILE_PATH)
        if (signalSources.value.length === 0) {
            loadingError.value = "EDF file was decoded, but no channels could be converted to signal sources."
        }
    } catch (error) {
        loadingError.value =
            error instanceof Error
                ? error.message
                : `Unknown EDF loading error: ${String(error)}`
    } finally {
        isLoadingChannels.value = false
    }
})

</script>


<template>
    <div v-if="isLoadingChannels" class="m-4 rounded border border-slate-700 bg-black p-3 text-slate-200">
        Loading EDF channels from {{ EDF_FILE_PATH }}...
    </div>
    <div v-else-if="loadingError" class="m-4 rounded border border-red-700 bg-black p-3 text-red-300">
        Failed to load EDF channels: {{ loadingError }}
    </div>
    <div v-else>
        <section>
            <PlotComponent :annotations="annotations" :signalSources="signalSources">
            </PlotComponent>
        </section>
    </div>
</template>

<style scoped></style>
