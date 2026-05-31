import type { ComputedRef, InjectionKey } from 'vue'

export const TREE_TOGGLE_RATIO = 0.6
export const TREE_TOGGLE_MIN_SIZE = 16
export const TREE_TOGGLE_MAX_SIZE = 24
export const TREE_TOGGLE_LAYOUT_SIZE = 18

export type TreeRowMetrics = {
    toggleSize: ComputedRef<number>
}

export const TREE_ROW_METRICS_KEY = Symbol('TREE_ROW_METRICS_KEY') as InjectionKey<TreeRowMetrics>

export function resolveTreeToggleSize(rowHeight = 0): number {
	return Math.min(TREE_TOGGLE_MAX_SIZE, Math.max(TREE_TOGGLE_MIN_SIZE, Math.round(rowHeight * TREE_TOGGLE_RATIO)))
}

export function resolveTreeConnectorTailWidth(toggleSize: number): number {
	return 3 * Math.round(toggleSize / 2)
}
