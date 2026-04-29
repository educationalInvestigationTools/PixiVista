import { LayoutDesign } from "@/lib/signal-visualizer/core/rendering/layoutDesign";
import type { PositionData } from "@/lib/signal-visualizer/core/types/positionData";
import type { SizeData } from "@/lib/signal-visualizer/core/types/sizeData";
import type { LineLayerDescription } from "./types/lineLayerDescription";

export class LineLabelsLayout extends LayoutDesign {
    description: LineLayerDescription;
    constructor(description: LineLayerDescription) {
        super();
        this.description = description;
    }

    buildLabelPosition(i: number): PositionData {
        return this.description.orientation === 'horizontal' ? this.buildLabelPositionHorizontal(i) : this.buildLabelPositionVertical(i);
    }

    buildLabelPositionVertical(i: number): PositionData {
        const n = this.description.positionsNormalized.length;
        const positionsNormalized = this.description.positionsNormalized;
        const y = 0;
        const x = 0;
        if (n === 1) {
            return { x: 0, y: 0 };
        }

        if (i === 0) {
            return {
                x,
                y,
            };
        }
        if (i === n - 1) {
            const distance = 1 - positionsNormalized[n - 2]!;
            return {
                x,
                y: this.height - this.height * distance / 2,
            };
        }
        const prevDistance = (positionsNormalized[i]! - positionsNormalized[i - 1]!) / 2;

        return {
            x,
            y: this.height * (positionsNormalized[i]! - prevDistance)
        };
    }

    buildLabelPositionHorizontal(i: number): PositionData {
        const n = this.description.positionsNormalized.length;
        const positionsNormalized = this.description.positionsNormalized;
        const y = 0;
        if (n === 1) {
            return { x: 0, y: 0 };
        }

        if (i === 0) {
            return {
                x: 0,
                y,
            };
        }
        if (i === n - 1) {
            const distance = 1 - positionsNormalized[n - 2]!;
            return {
                x: this.width - this.width * distance / 2,
                y,
            };
        }
        const prevDistance = (positionsNormalized[i]! - positionsNormalized[i - 1]!) / 2;

        return {
            x: this.width * (positionsNormalized[i]! - prevDistance),
            y
        };
    }

    buildLabelSize(i: number): SizeData {
        return this.description.orientation === 'horizontal' ? this.buildLabelSizeHorizontal(i) : this.buildLabelSizeVertical(i);
    }

    buildLabelSizeVertical(i: number): SizeData {
        const height = this.height;
        const width = this.width;
        const n = this.description.positionsNormalized.length;
        const positionsNormalized = this.description.positionsNormalized;

        if (n === 1) {
            return {
                width,
                height
            };
        }
        if (i === 0) {
            const distance = positionsNormalized[1]!;
            return {
                width,
                height: height * distance / 2,
            };
        }
        if (i === n - 1) {
            const distance = 1 - positionsNormalized[n - 2]!;
            return {
                width,
                height: height * distance / 2,
            };
        }
        const prevDistance = (positionsNormalized[i]! - positionsNormalized[i - 1]!) / 2;
        const nextDistance = (positionsNormalized[i + 1]! - positionsNormalized[i]!) / 2;

        return {
            width,
            height: this.height * (prevDistance + nextDistance),
        };
    }

    buildLabelSizeHorizontal(i: number): SizeData {
        const height = this.height;
        const n = this.description.positionsNormalized.length;
        const positionsNormalized = this.description.positionsNormalized;

        if (n === 1) {
            return {
                width: this.width,
                height
            };
        }
        if (i === 0) {
            const distance = positionsNormalized[1]!;
            return {
                width: this.width * distance / 2,
                height,
            };
        }
        if (i === n - 1) {
            const distance = 1 - positionsNormalized[n - 2]!;
            return {
                width: this.width * distance / 2,
                height,
            };
        }
        const prevDistance = (positionsNormalized[i]! - positionsNormalized[i - 1]!) / 2;
        const nextDistance = (positionsNormalized[i + 1]! - positionsNormalized[i]!) / 2;

        return {
            width: this.width * (prevDistance + nextDistance),
            height
        };
    }

}
