<script setup lang="ts">
import { DestroyCommand } from '@/application/commands/destroyCommand';
import { usePerformanceMetricsBridge } from '@/metricsComponent/presentation/utils/usePerformanceMetricsBridge';
import { ChangeViewPortCommand } from '@/plotComponent/application/commands/changeViewPortCommand';
import type { SignalSourceManager } from '@/plotComponent/application/interfaces/signalSource';
import type { ViewPort } from '@/plotComponent/application/types/viewPort';
import { PlotComponentContainer } from '@/plotComponent/domain/plotComponentContainer';
import { useKeysForViewPort } from '@/plotComponent/presentation/plotComponent/utils/useKeysForViewPort';
import { usePinchForZoom } from '@/plotComponent/presentation/plotComponent/utils/usePinchForZoom';
import { useWheelForZoom } from '@/plotComponent/presentation/plotComponent/utils/useWheelForZoom';

import { useResizeObserver } from '@/presentation/utils/useResizeObserver';
import { fmtTime } from '@/utils/timeFormatters';
import { ref, computed, onMounted, onBeforeUnmount, type Ref } from 'vue';
import SliderComponent from '@/presentation/sliderComponent/SliderComponent.vue';
import SettingsComponent from '@/presentation/settingsComponent/SettingsComponent.vue';
import AnnotationsComponent from '@/presentation/annotationsComponent/AnnotationsComponent.vue';
import MetricsComponent from '@/metricsComponent/presentation/MetricsComponent.vue';
import {
    ColorProperty,
    ShapeProperty,
    type AnnotationNode,
} from '@/presentation/annotationsComponent/objectAnnotationData';
import type { CurrentViewPortSamples } from '@/presentation/sliderComponent/types';
import type { AnyUpdateChoice } from '@/presentation/settingsComponent/settingsChoice';
import { ChoiceTreeNode, type SettingsTreeNode, LabelTreeNode } from '@/presentation/settingsComponent/settingsTreeNodes';
import { ChannelAnnotationNode, RootAnnotationNode } from '@/plotComponent/presentation/plotComponent/plotAnnotationNode';
import { useViewPortDrag } from '@/plotComponent/presentation/plotComponent/utils/useHorizontalScrolling';


const props = defineProps<{
    workerCallback: () => Worker,
    signalSourcesManager: SignalSourceManager
}>()

const heightPerChannel = ref(100)

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
const themeSettingId = 'theme-mode'
const channelsRootId = 'channels'
const channelsGroupLabel = 'Channels'
const channelIdPrefix = 'channel:'
const themeMode = ref(getInitialTheme())

const settingsTrees = computed<SettingsTreeNode[]>(() => [
    new LabelTreeNode('visibility-settings', 'Visibility', [
        new ChoiceTreeNode({
            id: showMetricsSettingId,
            label: 'Metrics',
            value: showMetricsPanel.value,
        }),
        new ChoiceTreeNode({
            id: showAnnotationsSettingId,
            label: 'Annotations',
            value: showAnnotationsPanel.value,
        }),
    ]),
    new LabelTreeNode('plot-settings', 'Plot', [
        new ChoiceTreeNode({
            id: heightPerChannelSettingId,
            label: 'Channel height',
            value: heightPerChannel.value,
            min: 60,
            max: 600,
            format: (x) => x + ' px',
        }),
    ]),
    new LabelTreeNode('personalization-settings', 'Personalization', [
        new ChoiceTreeNode({
            id: themeSettingId,
            label: 'Theme',
            value: themeMode.value,
            options: ['dark', 'light'],
            format: (value: string) => value.charAt(0).toUpperCase() + value.slice(1),
        }),
    ]),
])

function updateSettingChoice(settingUpdate: AnyUpdateChoice) {
    if (settingUpdate.id === showMetricsSettingId) {
        showMetricsPanel.value = settingUpdate.value as boolean
    }

    if (settingUpdate.id === showAnnotationsSettingId) {
        showAnnotationsPanel.value = settingUpdate.value as boolean
    }

    if (settingUpdate.id === themeSettingId) {
        themeMode.value = settingUpdate.value as string
        applyTheme(themeMode.value)
    }

    if (settingUpdate.id === heightPerChannelSettingId) {
        heightPerChannel.value = settingUpdate.value as number
    }
}


const annotationsTree: Ref<AnnotationNode[]> = ref([])


const visibleChannels = computed(() => {
    if (annotationsTree.value.length === 0)
        return 0
    const channelsNode = annotationsTree.value[0]!.children
    return channelsNode.reduce((count, node) => {
        return count + (node.visibility.Value ? 1 : 0)
    }, 0)
})


onMounted(async () => {
    if (!htmlContainerRef.value) {
        return;
    }
    applyTheme(themeMode.value)

    diContainer = new PlotComponentContainer()
    annotationsTree.value = buildAnnotationsTree()
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

    useViewPortDrag(
        htmlContainerRef,
        (nextSeconds) => updateViewPort(nextSeconds, undefined),
        () => viewPortRef.value.startSeconds,
        () => viewPortRef.value.lengthSeconds,
    )

    await diContainer.init(htmlContainerRef.value, props.signalSourcesManager, props.workerCallback)
    updateViewPort(viewPortRef.value.startSeconds, viewPortRef.value.lengthSeconds)
    bindResizeObserver(htmlContainerRef, diContainer.eventMediator)
    bindPerformanceMetrics(diContainer.eventMediator)

})

function getInitialTheme() {
    if (typeof document === 'undefined') {
        return 'dark'
    }
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
}

function applyTheme(theme: string) {
    if (typeof document === 'undefined') {
        return
    }
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light')
    } else {
        document.documentElement.removeAttribute('data-theme')
    }
}

function buildAnnotationsTree(): AnnotationNode[] {
    const channelNodes: ChannelAnnotationNode[] = props.signalSourcesManager.allSignalsBuildData.map((signal) => new ChannelAnnotationNode(
        channelIdPrefix + signal.label,
        signal.label,
        new ColorProperty('#ef4444'),
        new ShapeProperty('rectangle')
        , diContainer!.eventMediator))

    const channelsRoot: RootAnnotationNode = new RootAnnotationNode(
        channelsRootId, channelsGroupLabel, channelNodes, new ColorProperty('#334155'), new ShapeProperty('rectangle')
    )
    return [channelsRoot]
}


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
        <SettingsComponent :trees="settingsTrees" @update:choice="updateSettingChoice">
        </SettingsComponent>
        <AnnotationsComponent v-if="showAnnotationsPanel" :annotations="annotationsTree"></AnnotationsComponent>
        <div ref="htmlContainerRef" class="canvas__container" tabindex="0" :style="{
            height: heightPerChannel * (visibleChannels + 1) + 'px'
        }">
        </div>
        <SliderComponent :viewPortLowerBound="0" :sampleToString="(x) => fmtTime(x, true)"
            :lengthToString="(x) => fmtTime(x, false)" :currentViewPort="{
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

</style>
