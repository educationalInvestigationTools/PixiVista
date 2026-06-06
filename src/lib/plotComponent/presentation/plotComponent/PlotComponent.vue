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

import { useResizeObserver } from '@/presentation/utils/useResizeObserver';
import { fmtTime } from '@/utils/timeFormatters';
import { ref, computed, onMounted, onBeforeUnmount, type Ref } from 'vue';
import SliderComponent from '@/presentation/sliderComponent/SliderComponent.vue';
import SettingsComponent from '@/presentation/settingsComponent/SettingsComponent.vue';
import AnnotationsComponent from '@/plotComponent/presentation/annotationsComponent/AnnotationsComponent.vue';
import MetricsComponent from '@/metricsComponent/presentation/MetricsComponent.vue';
import type {
    AnnotationNode,
    AnnotationVisibilityChange,
} from '@/plotComponent/presentation/annotationsComponent/objectAnnotationData';
import type { CurrentViewPortSamples } from '@/presentation/sliderComponent/types';
import type { AnyUpdateChoice } from '@/presentation/settingsComponent/settingsChoice';
import { ChoiceTreeNode, type SettingsTreeNode, LabelTreeNode } from '@/presentation/settingsComponent/settingsTreeNodes';


const props = defineProps<{
    workerCallback: () => Worker,
    signalSourcesManager: SignalSourceManager
    annotations: Record<string, IntervalGroup>
}>()

const annotationsTree: Ref<AnnotationNode[]> = ref([])


const heightPerChannel = ref(200)

const visibleChannels = computed(() => {
    const channelsNode = findNodeById(annotationsTree.value, channelsRootId)
    if (!channelsNode || channelsNode.children.length === 0) {
        return 0
    }
    return channelsNode.children.reduce((count, node) => {
        return count + (node.state.visibility ? 1 : 0)
    }, 0)
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

function updateAnnotations(nextAnnotations: AnnotationNode[]) {
    annotationsTree.value = nextAnnotations
}

async function handleVisibilityChange(change: AnnotationVisibilityChange) {
    const channelIds = change.ids.filter((id) => id.startsWith(channelIdPrefix))
    if (channelIds.length === 0) {
        return
    }
    await Promise.all(
        channelIds.map((id) => {
            const channelLabel = id.slice(channelIdPrefix.length)
            return diContainer?.eventMediator.publish(new ChangeChannelVisibilityCommand(channelLabel, change.visibility))
        }),
    )
}

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

onMounted(async () => {
    if (!htmlContainerRef.value) {
        return;
    }
    annotationsTree.value = buildAnnotationsTree()
    applyTheme(themeMode.value)

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
    const channelNodes: AnnotationNode[] = props.signalSourcesManager.allSignalsBuildData.map((signal) => ({
        id: channelIdPrefix + signal.label,
        label: signal.label,
        style: {
            color: '#ef4444',
            drawingStyle: 'borders',
            shape: 'rectangle',
        },
        state: { visibility: true },
        children: []
    }))

    const channelsRoot: AnnotationNode = {
        id: channelsRootId,
        label: channelsGroupLabel,
        style: {
            color: '#334155',
            drawingStyle: 'borders',
            shape: 'rectangle',
        },
        state: { visibility: true },
        children: channelNodes,
    }

    const intervalGroupNodes: AnnotationNode[] = []
    for (const groupLabel in props.annotations) {
        const intervalGroup = props.annotations[groupLabel]!
        intervalGroupNodes.push({
            id: `interval-group:${groupLabel}`,
            label: groupLabel,
            style: {
                color: '#475569',
                drawingStyle: 'borders',
                shape: 'dashed-lines',
            },
            state: { visibility: true },
            children: intervalGroup.intervals.map((interval) => ({
                id: `interval:${groupLabel}:${interval.label}`,
                label: interval.label,
                style: {
                    color: interval.drawingColor,
                    drawingStyle: interval.drawingStyle,
                    shape: 'dashed-lines',
                },
                state: { visibility: true },
                children: []
            })),
        })
    }

    return [channelsRoot, ...intervalGroupNodes]
}

function findNodeById(nodes: AnnotationNode[], id: string): AnnotationNode | null {
    for (const node of nodes) {
        if (node.id === id) {
            return node
        }
        if (node.children.length) {
            const match = findNodeById(node.children, id)
            if (match) {
                return match
            }
        }
    }
    return null
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
        <AnnotationsComponent v-if="showAnnotationsPanel" :annotations="annotationsTree"
            @update:annotations="updateAnnotations" @change:visibility="handleVisibilityChange">
        </AnnotationsComponent>
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

.canvas__container {
    touch-action: none;
}
</style>
