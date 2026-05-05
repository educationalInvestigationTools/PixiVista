<script setup lang="ts">
import { DestroyCommand } from '@/application/commands/destroyCommand';
import { usePerformanceMetricsBridge } from '@/metricsComponent/presentation/utils/usePerformanceMetricsBridge';
import { ChangeChannelVisibilityCommand } from '@/plotComponent/application/commands/changeChannelVisibilityCommand';
import { ChangeViewPortCommand } from '@/plotComponent/application/commands/changeViewPortCommand';
import type { SignalSourceManager } from '@/plotComponent/application/interfaces/signalSource';
import type { IntervalGroup } from '@/plotComponent/application/types/highlightedInterval';
import type { ViewPort } from '@/plotComponent/application/types/viewPort';
import { PlotComponentContainer } from '@/plotComponent/domain/plotComponentContainer';
import { useKeysForViewPort } from '@/plotComponent/presentation/plotComponent/utils/useKeysForViewPort';
import { usePinchForZoom } from '@/plotComponent/presentation/plotComponent/utils/usePinchForZoom';
import { useWheelForZoom } from '@/plotComponent/presentation/plotComponent/utils/useWheelForZoom';
import type { AnyChoice, AnyUpdateChoice } from '@/presentation/settingsComponent/settingsChoice';

import { useResizeObserver } from '@/presentation/utils/useResizeObserver';
import { fmtTime } from '@/utils/utils';
import { ref, computed, onMounted, onBeforeUnmount, type Ref } from 'vue';
import SliderComponent from '@/presentation/sliderComponent/SliderComponent.vue';
import SettingsComponent from '@/presentation/settingsComponent/SettingsComponent.vue';
import AnnotationsComponent from '@/plotComponent/presentation/annotationsComponent/AnnotationsComponent.vue';
import MetricsComponent from '@/metricsComponent/presentation/MetricsComponent.vue';
import type { ObjectAnnotationData, ObjectVisibility } from '@/plotComponent/presentation/annotationsComponent/objectAnnotationData';
import type { CurrentViewPortSamples } from '@/presentation/sliderComponent/types';


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
let diContainer: PlotComponentContainer | null = null;

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

const settingsChoices = computed<AnyChoice[]>(() => [
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
        format: (x) => x + " px"
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

function updateSettingChoice(settingUpdate: AnyUpdateChoice) {
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

    diContainer = new PlotComponentContainer()
    /*composables should go before the first await statment, Vue says*/
    useWheelForZoom(htmlContainerRef, (zoomFactor: number) => {
        const newLengthSeconds = viewPortRef.value.lengthSeconds * zoomFactor
        updateViewPort(undefined, newLengthSeconds)
    })

    usePinchForZoom(htmlContainerRef, (zoomFactor: number) => {
        const newLengthSeconds = viewPortRef.value.lengthSeconds * zoomFactor
        updateViewPort(undefined, newLengthSeconds)
    })


    useKeysForViewPort(
        htmlContainerRef,
        (down: boolean) => {
            const currentLengthSeconds = viewPortRef.value.lengthSeconds
            const nextLengthSeconds = currentLengthSeconds * (down ? 0.9 : 1.1)
            updateViewPort(undefined, nextLengthSeconds)
        },
        (left: boolean) => {
            const currentSeconds = viewPortRef.value.startSeconds
            const nextSeconds = currentSeconds + (left ? -1 : 1)
            updateViewPort(nextSeconds, undefined)
        })

    await diContainer.init(htmlContainerRef.value, props.signalSourcesManager, props.workerCallback)
    updateViewPort(viewPortRef.value.startSeconds, viewPortRef.value.lengthSeconds)
    bindResizeObserver(htmlContainerRef, diContainer.eventMediator)
    bindPerformanceMetrics(diContainer.eventMediator)

})


onBeforeUnmount(async () => {
    await diContainer?.eventMediator.publish(new DestroyCommand())
})

async function updateViewPort(startSeconds?: number, lengthSeconds?: number) {
    viewPortRef.value = {
        startSeconds: startSeconds === undefined ? viewPortRef.value.startSeconds : Math.max(0, startSeconds),
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
        <AnnotationsComponent v-if="showAnnotationsPanel" :objectsAnnotations="objectsAnnotationsData"
            @toggleObjectVisibility="toggleObjectVisibility">
        </AnnotationsComponent>
        <div ref="htmlContainerRef" class="canvas__container" tabindex="0" :style="{
            height: heightPerChannel * (visibleChannels + 1) + 'px'
        }">
        </div>
        <SliderComponent :viewPortLowerBound="0" :sampleToString="(x) => fmtTime(x, true)" :lengthToString="(x) => fmtTime(x, false)"
            :currentViewPort="{
                currentSamplePosition: viewPortRef.startSeconds,
                lengthSamples: viewPortRef.lengthSeconds,
            }" :viewPortUpperBound=signalsLargestDurationSeconds @update:viewPort='updateViewPortFromSlider'>
        </SliderComponent>
        <MetricsComponent :metrics="performanceMetricsRef" v-if="showMetricsPanel"></MetricsComponent>
    </div>

</template>

<style scoped>
.plot__container {
    display: flex;
    flex-direction: column;
}

.canvas__container {
    touch-action: none;
}
</style>
