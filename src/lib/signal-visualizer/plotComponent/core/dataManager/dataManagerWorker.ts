import type { SignalSourceManager } from '@/lib/signal-visualizer/plotComponent/application/interfaces/signalSource.ts'
import type { ViewPort } from '@/lib/signal-visualizer/plotComponent/application/types/viewPort.ts'
import type { DataManager } from './dataManager.ts'
import type { FetchDataRequest } from './fetchDataRequest.ts'
import type { ReceivedRequest } from './receivedRequest.ts'
import type { OneDimNormalizedSignal } from '@/lib/signal-visualizer/plotComponent/application/types/oneDimNormalizedSignal.ts'

export class DataManagerWorker implements DataManager {
    private worker: Worker
    private pendingRequests: Map<string, (value: OneDimNormalizedSignal[]) => void> = new Map()

    constructor(workerCallback: () => Worker, signalSourcesManager: SignalSourceManager) {
        this.worker = workerCallback()
        this.worker.onmessage = this.handleWorkerMessage.bind(this)
        this.worker.postMessage({ type: 'init', data: signalSourcesManager.serialize() })
    }

    async fetchData(
        labels: string[],
        viewPort: ViewPort,
        expectedWidth: number,
    ): Promise<OneDimNormalizedSignal[]> {
        const requestId = crypto.randomUUID()
        const promise = new Promise<OneDimNormalizedSignal[]>((resolve) => {
            this.pendingRequests.set(requestId, resolve)
        })
        this.worker.postMessage({
            requestId,
            labels: labels,
            viewPort: {
                startSeconds: viewPort.startSeconds,
                lengthSeconds: viewPort.lengthSeconds,
            },
            expectedWidth: expectedWidth,
        } satisfies FetchDataRequest)

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
