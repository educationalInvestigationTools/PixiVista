<script setup lang="ts">

import { computed, onBeforeUnmount, onMounted, ref, type Ref } from "vue";
import { DiContainer } from "@/lib/signal-visualizer/application/diContainer.ts";
import { ResizeDto } from "@/lib/signal-visualizer/application/commands/resizeCommand.ts";
import { type SignalSource } from "@/lib/signal-visualizer/application/types/signalSource.ts";
import SliderComponent from "@/lib/signal-visualizer/presentation/SliderComponent.vue";
import SettingsComponent from "@/lib/signal-visualizer/presentation/SettingsComponent.vue";
import AnnotationsComponent, { type ObjectAnnotationData, type ObjectVisibility } from "@/lib/signal-visualizer/presentation/AnnotationsComponent.vue";
import MetricsComponent from "@/lib/signal-visualizer/presentation/MetricsComponent.vue"
import type {
    PerformanceMetrics
} from "@/lib/signal-visualizer/application/types/performanceMetrics.ts";
import { EventMediator } from "@/lib/signal-visualizer/utils/eventMediator.ts";
import { fmtTime } from "../utils/utils";
import { ViewPort } from "@/lib/signal-visualizer/application/types/viewPort.ts";
import type { IntervalGroup } from "../application/types/highlightedInterval";


const props = defineProps<{
    signalSources: SignalSource[]
    annotations: Record<string, IntervalGroup>
}>()

const objectsAnnotationsData : Ref<Record<string, Record<string, ObjectAnnotationData>>> = ref({})

async function toggleObjectVisibility(objectVisibility: ObjectVisibility) {
    const groupLabel = objectVisibility.groupLabel
    const label = objectVisibility.label
    const visibility = objectVisibility.visibility
    objectsAnnotationsData.value[groupLabel]![label]!.visibility = visibility
    if(groupLabel === 'Channels'){
        await diContainer?.changeChannelVisibilityHandler.handle(label, visibility)
    }
}

const heightPerChannel = ref(200)

const visibleChannels = computed(() => {
    let visible = 0
    const channels = objectsAnnotationsData.value['Channels']!
    for (const label in channels) {
        if (channels[label]!.visibility) {
            visible++
        }
    }
    return visible
})


const htmlContainerRef = ref<HTMLDivElement | null>(null);
const resizeObserverRef = ref<ResizeObserver | null>(null)
let diContainer: DiContainer | null = null;

const signalsLargestDurationSeconds = Math.max(...props.signalSources.map(signal => signal.totalSeconds))
const viewPortRef = ref(new ViewPort(0, 10))

const performanceMetrics = ref<PerformanceMetrics | undefined>(undefined)

const showMetricsPanel = ref(true)
const showAnnotationsPanel = ref(true)


onMounted(async () => {
    if (!htmlContainerRef.value) {
        return;
    }
    objectsAnnotationsData.value['Channels'] = {}
    for (let i = 0; i < props.signalSources.length; i++) {
        const signal = props.signalSources[i]!
        objectsAnnotationsData.value['Channels'][signal.label] = {
            label: signal.label,
            group: 'Channels',
            visibility: true,
            shape: 'rectangle',
            color : 'red'
        }
    }

    for (const groupLabel in props.annotations) {
        const intervalGroup = props.annotations[groupLabel]!
        objectsAnnotationsData.value[groupLabel] = {}
        for (let i = 0; i < intervalGroup.intervals.length; i++){
            const interval = intervalGroup.intervals[i]!
            objectsAnnotationsData.value[groupLabel]![interval.label]! = {
                label: interval.label,
                group: groupLabel,
                visibility: true,
                shape: 'dashed-lines',
                color: 'blue',
            }
        }
    }

    const viewPort = viewPortRef.value
    const eventMediator = new EventMediator((metrics: PerformanceMetrics) => performanceMetrics.value = metrics)
    diContainer = new DiContainer(htmlContainerRef.value, viewPort, props.signalSources, eventMediator);
    await diContainer.init()


    resizeObserverRef.value = new ResizeObserver(async () => {
        if (htmlContainerRef.value) {
            const width = htmlContainerRef.value.clientWidth;
            const height = htmlContainerRef.value.clientHeight;
            await diContainer?.resizeHandler.handle(new ResizeDto(width, height));
        }
    })
    resizeObserverRef.value.observe(htmlContainerRef.value);
})

onBeforeUnmount(() => resizeObserverRef.value!.disconnect())

onBeforeUnmount(async () => {
    diContainer?.destroyHandler.handle()
})


async function updateViewPort(viewPort: ViewPort) {
    viewPortRef.value = viewPort
    await diContainer?.changeViewPortHandler.handle(viewPortRef.value)
}

</script>


<template>
    <div class="m-4 border border-slate-700 rounded p-2 bg-slate-900 text-slate-200">
        <SettingsComponent v-model:showAnnotations="showAnnotationsPanel" v-model:showMetrics="showMetricsPanel"
            v-model:heightPerChannel="heightPerChannel">
        </SettingsComponent>
        <AnnotationsComponent  v-show="showAnnotationsPanel" :objectsAnnotations="objectsAnnotationsData"
            @toggleObjectVisibility="toggleObjectVisibility">
        </AnnotationsComponent>
        <div class="border border-slate-700 rounded p-2 bg-slate-900">
            <div ref="htmlContainerRef" class="bg-slate-900" :style="{
                height: heightPerChannel * (visibleChannels + 1) + 'px'
            }">
            </div>
        </div>
        <SliderComponent :sampleToString="fmtTime" :leftSliderPositionPercent="15" :rightSliderPositionPercent="5"
            :viewPort="viewPortRef" :viewPortLargestValueSamples=signalsLargestDurationSeconds
            @update:viewPort='updateViewPort'>
        </SliderComponent>
        <MetricsComponent :metrics="performanceMetrics" v-show="showMetricsPanel"></MetricsComponent>
    </div>

</template>

<style scoped></style>
