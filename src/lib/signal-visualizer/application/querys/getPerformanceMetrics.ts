import type { EventToMediate } from "../../utils/eventMediator";
import type { PerformanceMetrics } from "../types/performanceMetrics";

export const GetPerformanceMetricsEventLabel = "GetPerformanceMetricsEventLabel"

export class GetPerformanceMetrics implements EventToMediate {
    eventLabel: string = GetPerformanceMetricsEventLabel
    performanceMetrics: PerformanceMetrics

    constructor(performanceMetrics: PerformanceMetrics) {
        this.performanceMetrics = performanceMetrics
    }
}
