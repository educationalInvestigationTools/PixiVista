import { SignalSourceManager } from '@/lib/signal-visualizer/plotComponent/application/interfaces/signalSource.ts'
import { DataManagerNaive } from './dataManagerNaive.ts'
import type { FetchDataRequest } from './fetchDataRequest.ts'
import type { ReceivedRequest } from './receivedRequest.ts'

export function buildWorkerRunTime(signalManager: SignalSourceManager) {
    let dataManager: DataManagerNaive | null = null
    const manager = signalManager
    self.onmessage = async (event: MessageEvent) => {
        const data = event.data
        if (data.type === 'init') {
            const signalsSourceBuildData = data.data as string
            manager.deSerialize(signalsSourceBuildData)
            dataManager = new DataManagerNaive(manager)
        } else {
            const { requestId, labels, viewPort, expectedWidth } = data as FetchDataRequest
            const signalsData = await dataManager!.fetchData(
                labels,
                {
                    startSeconds: viewPort.startSeconds,
                    lengthSeconds: viewPort.lengthSeconds,
                },
                expectedWidth,
            )

            const response: ReceivedRequest = {
                requestId,
                signalsData,
            }
            self.postMessage(response)
        }
    }
}
