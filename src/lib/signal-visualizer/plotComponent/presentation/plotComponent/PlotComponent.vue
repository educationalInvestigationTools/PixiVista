<script setup lang="ts">

import { computed, onBeforeUnmount, onMounted, ref, type Ref } from "vue";
import { DirtyContainer } from "@/lib/signal-visualizer/plotComponent/domain/dirtyContainer.ts";
import SliderComponent, {
    type CurrentViewPortSamples
} from "@/lib/signal-visualizer/presentation/sliderComponent/SliderComponent.vue";
import SettingsComponent
    from "@/lib/signal-visualizer/presentation/settingsComponent/SettingsComponent.vue";
import AnnotationsComponent, {
    type ObjectAnnotationData,
    type ObjectVisibility
} from "@/lib/signal-visualizer/plotComponent/presentation/annotationsComponent/AnnotationsComponent.vue";
import MetricsComponent from "../../../metricsComponent/presentation/MetricsComponent.vue";
import type {
    AnySettingChoice,
    AnySettingChoiceUpdate
} from "@/lib/signal-visualizer/presentation/settingsComponent/settingsChoice.ts";
import { fmtTime } from "../../../utils/utils.ts";
import type {
    IntervalGroup
} from "@/lib/signal-visualizer/plotComponent/application/types/highlightedInterval.ts";
import type { ViewPort } from "@/lib/signal-visualizer/plotComponent/application/types/viewPort.ts";
import type {
    SignalSourceManager
} from "@/lib/signal-visualizer/plotComponent/application/interfaces/signalSource.ts";
import {
    ChangeChannelVisibilityCommand
} from "@/lib/signal-visualizer/plotComponent/application/commands/changeChannelVisibilityCommand.ts";
import {
    DestroyCommand
} from "@/lib/signal-visualizer/application/commands/destroyCommand.ts";
import {
    ChangeViewPortCommand
} from "@/lib/signal-visualizer/plotComponent/application/commands/changeViewPortCommand.ts";
import { useResizeObserver } from "@/lib/signal-visualizer/presentation/utils/useResizeObserver.ts";
import {
    usePerformanceMetricsBridge
} from "@/lib/signal-visualizer/metricsComponent/presentation/utils/usePerformanceMetricsBridge.ts";
import { useWheelForZoom } from "../utils/useWheelForZoom.ts";


const props = defineProps<{
    workerCallback: () => Worker,
    signalSourcesManager: SignalSourceManager
    annotations: Record<string, IntervalGroup>
}>()

const objectsAnnotationsData: Ref<Record<string, Record<string, ObjectAnnotationData>>> = ref({})


const heightPerChannel = ref(200)

const visibleChannels = computed(() => {
    let visible = 0
    const channels = objectsAnnotationsData.value[channelsGroup]!
    for (const label in channels) {
        if (channels[label]!.visibility) {
            visible++
        }
    }
    return visible
})


const htmlContainerRef = ref<HTMLDivElement | null>(null);
let diContainer: DirtyContainer | null = null;

const signalsLargestDurationSeconds = Math.max(...props.signalSourcesManager.allSignalsBuildData.map(signal => signal.totalSeconds))
const viewPortRef: Ref<ViewPort> = ref({
    startSeconds: 0,
    lengthSeconds: 10
})

const {
    performanceMetricsRef,
    bindPerformanceMetrics,
} = usePerformanceMetricsBridge()
const {
    bindResizeObserver,
} = useResizeObserver()
const showMetricsPanel = ref(true)
const showAnnotationsPanel = ref(true)
const showMetricsSettingId = 'show-metrics-panel'
const showAnnotationsSettingId = 'show-annotations-panel'
const heightPerChannelSettingId = 'height-per-channel'
const channelsGroup = "Channels"

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

async function toggleObjectVisibility(objectVisibility: ObjectVisibility) {
    const groupLabel = objectVisibility.groupLabel
    const label = objectVisibility.label
    const visibility = objectVisibility.visibility
    objectsAnnotationsData.value[groupLabel]![label]!.visibility = visibility
    if (groupLabel === channelsGroup) {
        await diContainer?.eventMediator.publish(new ChangeChannelVisibilityCommand(label, visibility))
    }
}

function updateSettingChoice(settingUpdate: AnySettingChoiceUpdate) {
    if (settingUpdate.id === showMetricsSettingId) {
        showMetricsPanel.value = settingUpdate.value as boolean
    }

    if (settingUpdate.id === showAnnotationsSettingId) {
        showAnnotationsPanel.value = settingUpdate.value as boolean
    }

    if (settingUpdate.id === heightPerChannelSettingId) {
        heightPerChannel.value = settingUpdate.value as number
    }
}

onMounted(async () => {
    if (!htmlContainerRef.value) {
        return;
    }
    objectsAnnotationsData.value[channelsGroup] = {}
    const allSignalsBuildData = props.signalSourcesManager.allSignalsBuildData
    for (let i = 0; i < allSignalsBuildData.length; i++) {
        const signal = allSignalsBuildData[i]!
        objectsAnnotationsData.value[channelsGroup][signal.label] = {
            label: signal.label,
            group: channelsGroup,
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
                color: interval.drawingColor,
            }
        }
    }

    const viewPort = viewPortRef.value
    diContainer = new DirtyContainer();
    await diContainer.init(htmlContainerRef.value, viewPort, props.signalSourcesManager, props.workerCallback)

    bindResizeObserver(htmlContainerRef, diContainer.eventMediator)
    bindPerformanceMetrics(diContainer.eventMediator)

    useWheelForZoom(htmlContainerRef, (zoomFactor: number) => {
        const newLengthSeconds = viewPortRef.value.lengthSeconds * zoomFactor
        updateViewPort(undefined, newLengthSeconds)
    })
})


onBeforeUnmount(async () => {
    await diContainer?.eventMediator.publish(new DestroyCommand())
})

async function updateViewPort(startSeconds?: number, lengthSeconds?: number) {
    viewPortRef.value = {
        startSeconds: startSeconds === undefined ? viewPortRef.value.startSeconds : startSeconds,
        lengthSeconds: lengthSeconds === undefined ? viewPortRef.value.lengthSeconds : Math.min(60, lengthSeconds)
    }
    await diContainer?.eventMediator.publish(new ChangeViewPortCommand(viewPortRef.value))
}

async function updateViewPortFromSlider(viewPort: CurrentViewPortSamples) {
    await updateViewPort(viewPort.currentSamplePosition, viewPort.lengthSamples)
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
            :leftSliderPositionPercent="5" :rightSliderPositionPercent="95" :currentViewPort="{
                currentSamplePosition: viewPortRef.startSeconds,
                lengthSamples: viewPortRef.lengthSeconds,
            }" :viewPortLargestValueSamples=signalsLargestDurationSeconds @update:viewPort='updateViewPortFromSlider'>
        </SliderComponent>
        <MetricsComponent :metrics="performanceMetricsRef" v-show="showMetricsPanel"></MetricsComponent>
    </div>

</template>

<style scoped>
.plot__container {
    display: flex;
    flex-direction: column;
}
</style>
