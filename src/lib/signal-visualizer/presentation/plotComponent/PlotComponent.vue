<script setup lang="ts">

import { computed, onBeforeUnmount, onMounted, ref, type Ref } from "vue";
import { DiContainer } from "@/lib/signal-visualizer/application/diContainer.ts";
import { ResizeDto } from "@/lib/signal-visualizer/application/commands/resizeCommand.ts";
import { type SignalSource } from "@/lib/signal-visualizer/application/types/signalSource.ts";
import SliderComponent, { type CurrentViewPortSamples } from "@/lib/signal-visualizer/presentation/sliderComponent/SliderComponent.vue";
import SettingsComponent from "../settingsComponent/SettingsComponent.vue";
import AnnotationsComponent, { type ObjectAnnotationData, type ObjectVisibility } from "@/lib/signal-visualizer/presentation/annotationsComponent/AnnotationsComponent.vue";
import MetricsComponent from "../metricsComponent/MetricsComponent.vue";
import type {
    PerformanceMetrics
} from "@/lib/signal-visualizer/application/types/performanceMetrics.ts";
import type { AnySettingChoice, AnySettingChoiceUpdate } from "@/lib/signal-visualizer/presentation/settingsComponent/settingsChoice";
import { EventMediator } from "@/lib/signal-visualizer/utils/eventMediator.ts";
import { fmtTime } from "../../utils/utils";
import { ViewPort } from "@/lib/signal-visualizer/application/types/viewPort.ts";
import type { IntervalGroup } from "../../application/types/highlightedInterval";


const props = defineProps<{
    signalSources: SignalSource[]
    annotations: Record<string, IntervalGroup>
}>()

const objectsAnnotationsData: Ref<Record<string, Record<string, ObjectAnnotationData>>> = ref({})

async function toggleObjectVisibility(objectVisibility: ObjectVisibility) {
    const groupLabel = objectVisibility.groupLabel
    const label = objectVisibility.label
    const visibility = objectVisibility.visibility
    objectsAnnotationsData.value[groupLabel]![label]!.visibility = visibility
    if (groupLabel === 'Channels') {
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
const showMetricsSettingId = 'show-metrics-panel'
const showAnnotationsSettingId = 'show-annotations-panel'
const heightPerChannelSettingId = 'height-per-channel'

const settingsChoices = computed<AnySettingChoice[]>(() => [
    {
        id: showMetricsSettingId,
        label: 'Metrics',
        value: showMetricsPanel.value,
    },
    {
        id: showAnnotationsSettingId,
        label: 'Annotations',
        value: showAnnotationsPanel.value,
    },
    {
        id: heightPerChannelSettingId,
        label: 'Height / channel',
        value: heightPerChannel.value,
        min: 60,
        max: 600,
        step: 10,
        toString: (x) => x + " px"
    }
])

function updateSettingChoice(settingUpdate: AnySettingChoiceUpdate) {
    if (settingUpdate.id === showMetricsSettingId && typeof settingUpdate.value === 'boolean') {
        showMetricsPanel.value = settingUpdate.value
    }

    if (settingUpdate.id === showAnnotationsSettingId && typeof settingUpdate.value === 'boolean') {
        showAnnotationsPanel.value = settingUpdate.value
    }

    if (settingUpdate.id === heightPerChannelSettingId && typeof settingUpdate.value === 'number') {
        heightPerChannel.value = settingUpdate.value
    }
}


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
            color: 'red'
        }
    }

    for (const groupLabel in props.annotations) {
        const intervalGroup = props.annotations[groupLabel]!
        objectsAnnotationsData.value[groupLabel] = {}
        for (let i = 0; i < intervalGroup.intervals.length; i++) {
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


async function updateViewPort(viewPort: CurrentViewPortSamples) {

    viewPortRef.value = new ViewPort(
        viewPort.currentSamplePosition,
        Math.min(60, viewPort.lengthSamples)
    )
    await diContainer?.changeViewPortHandler.handle(viewPortRef.value)
}

</script>


<template>
    <div class="plot__container">
        <SettingsComponent :choices="settingsChoices" @update:choice="updateSettingChoice">
        </SettingsComponent>
        <AnnotationsComponent v-show="showAnnotationsPanel" :objectsAnnotations="objectsAnnotationsData"
            @toggleObjectVisibility="toggleObjectVisibility">
        </AnnotationsComponent>
        <div ref="htmlContainerRef" class="canvas__container" :style="{
            height: heightPerChannel * (visibleChannels + 1) + 'px'
        }">
        </div>
        <SliderComponent :sampleToString="(x) => fmtTime(x, true)" :lengthToString="(x) => fmtTime(x, false)"
            :leftSliderPositionPercent="5" :rightSliderPositionPercent="95"
            :currentViewPort="{
                currentSamplePosition: viewPortRef.startSeconds,
                lengthSamples: viewPortRef.lengthSeconds,
            }" :viewPortLargestValueSamples=signalsLargestDurationSeconds @update:viewPort='updateViewPort'>
        </SliderComponent>
        <MetricsComponent :metrics="performanceMetrics" v-show="showMetricsPanel"></MetricsComponent>
    </div>

</template>

<style scoped>
.plot__container {
    display: flex;
    flex-direction: column;
}
</style>
