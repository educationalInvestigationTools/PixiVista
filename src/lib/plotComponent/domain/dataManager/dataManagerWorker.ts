import type { SignalSourceManager } from "@/plotComponent/application/interfaces/signalSource"
import type { OneDimNormalizedSignal } from "@/plotComponent/application/types/oneDimNormalizedSignal"
import type { ViewPort } from "@/plotComponent/application/types/viewPort"
import type { DataManager } from "@/plotComponent/domain/dataManager/dataManager"
import type { InitRequest, FetchDataRequest, ReceivedRequest } from "@/plotComponent/domain/dataManager/requests"

function createRequestId(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

export class DataManagerWorker implements DataManager {
    private worker: Worker
    private pendingRequests: Map<string, (value: OneDimNormalizedSignal[]) => void> = new Map()

    constructor(workerCallback: () => Worker, signalSourcesManager: SignalSourceManager) {
        this.worker = workerCallback()
        this.worker.onmessage = this.handleWorkerMessage.bind(this)

        const initRequest: InitRequest = {
            type: 'Init',
            data: signalSourcesManager.serialize()
        }
        this.worker.postMessage(initRequest)
    }

    async fetchData(
        labels: string[],
        viewPort: ViewPort,
        expectedWidth: number,
    ): Promise<OneDimNormalizedSignal[]> {
        const requestId = createRequestId()
        const promise = new Promise<OneDimNormalizedSignal[]>((resolve) => {
            this.pendingRequests.set(requestId, resolve)
        })
        const fetchDataRequest: FetchDataRequest = {
            type : 'FetchDataRequest',
            requestId : requestId,
            labels: labels,
            viewPort: {
                startSeconds: viewPort.startSeconds,
                lengthSeconds: viewPort.lengthSeconds,
            },
            expectedWidth: expectedWidth,
        }
        this.worker.postMessage(fetchDataRequest)
        return promise
    }

    private handleWorkerMessage(event: MessageEvent<ReceivedRequest>) {
        const { requestId, signalsData } = event.data
        const resolve = this.pendingRequests.get(requestId)
        if (resolve) {
            resolve(signalsData)
            this.pendingRequests.delete(requestId)
        }
    }
}
