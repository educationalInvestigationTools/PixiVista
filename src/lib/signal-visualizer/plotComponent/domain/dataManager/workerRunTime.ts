import { SignalSourceManager } from '@/lib/signal-visualizer/plotComponent/application/interfaces/signalSource.ts'
import { DataManagerNaive } from './dataManagerNaive.ts'
import type { ReceivedRequest, WorkerRequest } from '@/lib/signal-visualizer/plotComponent/domain/dataManager/requests.ts'

export function buildWorkerRunTime(signalManager: SignalSourceManager) {
    let dataManager: DataManagerNaive | null = null
    const manager = signalManager
    self.onmessage = async (event: MessageEvent) => {
        const data: WorkerRequest = event.data
        if (data.type === 'Init') {
            const signalsSourceBuildData = data.data
            manager.deSerialize(signalsSourceBuildData)
            dataManager = new DataManagerNaive(manager)
        } else if (data.type === 'FetchDataRequest') {
            const { requestId, labels, viewPort, expectedWidth } = data
            const signalsData = await dataManager!.fetchData(
                labels,
                {
                    startSeconds: viewPort.startSeconds,
                    lengthSeconds: viewPort.lengthSeconds,
                },
                expectedWidth,
            )

            const response: ReceivedRequest = {
                type: 'ReceivedRequest',
                requestId,
                signalsData,
            }
            self.postMessage(response)
        }
    }
}
