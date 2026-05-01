import { GetPerformanceMetrics, GetPerformanceMetricsEventLabel } from "@/application/querys/getPerformanceMetrics"
import type { PerformanceMetrics } from "@/core/types/performanceMetrics"
import type { EventMediator } from "@/utils/eventMediator"
import { ref } from "vue"


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
