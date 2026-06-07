<script setup lang="ts">
import { SignalSourceManager, type SignalSourceBuildData } from '@/plotComponent/application/interfaces/signalSource'
import { MockSignalSerializer, MockSignalSourceConstructor } from '@/plotComponent/infrastructure/signals/mockSignalSource'
import PlotComponent from '@/plotComponent/presentation/plotComponent/PlotComponent.vue'

const signalSourcesBuildData: SignalSourceBuildData[] = [
    new MockSignalSourceConstructor(128, 180, 'Fpz-Cz'),
    new MockSignalSourceConstructor(128, 180, 'Pz-Oz'),
    new MockSignalSourceConstructor(64, 180, 'EOG')
]

const signalSourceSerializer = new MockSignalSerializer()

const manager = new SignalSourceManager()
manager.addSerializer(signalSourceSerializer)
signalSourcesBuildData.map(x => manager.addSignalBuildData(signalSourceSerializer.serializerId, x))


const mockPlotProps = {
    workerCallback: () => new Worker(
        new URL('./workerScript.ts', import.meta.url),
        {type: 'module'}
    ),
    signalSourcesManager: manager,
}
</script>

<template>
    <PlotComponent v-bind="mockPlotProps"/>
</template>

<style scoped></style>
