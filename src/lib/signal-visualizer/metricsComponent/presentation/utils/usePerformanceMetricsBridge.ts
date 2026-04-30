import { ref } from 'vue'
import type { PerformanceMetrics } from '@/lib/signal-visualizer/core/types/performanceMetrics'
import {
    GetPerformanceMetricsEventLabel,
    type GetPerformanceMetrics,
} from '@/lib/signal-visualizer/application/querys/getPerformanceMetrics'
import type { EventMediator } from '@/lib/signal-visualizer/utils/eventMediator'

export function usePerformanceMetricsBridge() {
    const performanceMetricsRef = ref<PerformanceMetrics | undefined>(undefined)

    function bindPerformanceMetrics(eventMediator: EventMediator) {
        eventMediator.addHandler<GetPerformanceMetrics>(
            GetPerformanceMetricsEventLabel,
            async (metrics) => {
                performanceMetricsRef.value = metrics.performanceMetrics
            },
        )
    }

    return {
        performanceMetricsRef,
        bindPerformanceMetrics,
    }
}
