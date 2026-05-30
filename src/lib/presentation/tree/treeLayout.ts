import type { ComputedRef, InjectionKey, Ref } from 'vue'

export const TREE_TOGGLE_RATIO = 0.6
export const TREE_TOGGLE_MIN_SIZE = 16

export type TreeRowMetrics = {
    toggleSize: ComputedRef<number>
}

export type TreeCollapsedState = Ref<Record<string, boolean>>

export const TREE_ROW_METRICS_KEY = Symbol('TREE_ROW_METRICS_KEY') as InjectionKey<TreeRowMetrics>
export const TREE_COLLAPSED_STATE_KEY = Symbol('TREE_COLLAPSED_STATE_KEY') as InjectionKey<TreeCollapsedState>

export function resolveTreeToggleSize(rowHeight: number): number {
	return Math.max(TREE_TOGGLE_MIN_SIZE, Math.round(rowHeight * TREE_TOGGLE_RATIO))
}

export function resolveTreeConnectorTailWidth(toggleSize: number): number {
	return 3 * Math.round(toggleSize / 2)
}
