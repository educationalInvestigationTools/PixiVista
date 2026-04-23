import { LayoutDesign } from "@/lib/signal-visualizer/core/rendering/layoutDesign";

export class LabelLayout extends LayoutDesign {
	static readonly BASE_FONT_SIZE = 14

	get baseFontSize(): number {
		return LabelLayout.BASE_FONT_SIZE
	}

	get minFontSize(): number {
		return 1
	}

	get availableWidth(): number {
		return Math.max(this.width, 1)
	}

	get availableHeight(): number {
		return Math.max(this.height, 1)
	}

	get maxFontSizeCandidate(): number {
		const maxDimension = Math.max(this.availableWidth, this.availableHeight)
		return Math.max(this.minFontSize, Math.floor(maxDimension))
	}

	fittedFontSize(maxLabelWidthAtBaseFont: number, maxLabelHeightAtBaseFont: number): number {
		if (maxLabelWidthAtBaseFont <= 0 || maxLabelHeightAtBaseFont <= 0) {
			return this.minFontSize
		}

		const widthScale = this.availableWidth / maxLabelWidthAtBaseFont
		const heightScale = this.availableHeight / maxLabelHeightAtBaseFont
		const scaledSize = Math.floor(this.baseFontSize * Math.min(widthScale, heightScale))
		const constrainedSize = Math.max(this.minFontSize, scaledSize)
		return Math.min(this.maxFontSizeCandidate, constrainedSize)
	}

	centeredX(textWidth: number): number {
		return (this.width - textWidth) / 2
	}

	centeredY(textHeight: number): number {
		return (this.height - textHeight) / 2
	}
}
