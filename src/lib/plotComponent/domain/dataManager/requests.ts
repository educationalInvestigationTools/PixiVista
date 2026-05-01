import type { OneDimNormalizedSignal } from "@/plotComponent/application/types/oneDimNormalizedSignal"

export type ReceivedRequest = {
    type: 'ReceivedRequest'
    requestId: string
    signalsData: OneDimNormalizedSignal[]
}

export type FetchDataRequest = {
    type : 'FetchDataRequest'
    requestId: string
    labels: string[]
    viewPort: {
        startSeconds: number,
        lengthSeconds: number,
    }
    expectedWidth: number
}

export type InitRequest = {
    type: 'Init'
    data: string
}

export type WorkerRequest = ReceivedRequest | FetchDataRequest | InitRequest
