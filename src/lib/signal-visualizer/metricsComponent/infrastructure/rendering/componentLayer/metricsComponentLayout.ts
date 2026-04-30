import { LayoutDesign } from '@/lib/signal-visualizer/core/rendering/layoutDesign.ts'
import type { Point2D } from '@/lib/signal-visualizer/core/types/point2D'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'

export class MetricsComponentLayout extends LayoutDesign {

    private get padding(): number {
        return Math.max(10, Math.min(this.width, this.height) * 0.04)
    }

    private get chartGap(): number {
        return Math.max(10, this.height * 0.05)
    }

    private get availableChartsHeight() {
        return Math.max(2, this.height - this.padding * 2)
    }

    private get chartHeight() {
        return Math.max(1, (this.availableChartsHeight - this.chartGap) / 2)
    }

    private get chartWidth() {
        return Math.max(1, this.width - this.padding * 2)
    }

    buildRefreshRateChartSize(): SizeData {
        return {
            width: this.chartWidth,
            height: this.chartHeight,
        }
    }

    buildRefreshRateChartPosition(): Point2D {
        return {
            x: this.padding,
            y: this.padding,
        }
    }

    buildRenderTimeChartSize(): SizeData {
        return {
            width: this.chartWidth,
            height: this.chartHeight,
        }
    }

    buildRenderTimeChartPosition(): Point2D {
        return {
            x: this.padding,
            y: this.padding + this.chartHeight + this.chartGap,
        }
    }
}
