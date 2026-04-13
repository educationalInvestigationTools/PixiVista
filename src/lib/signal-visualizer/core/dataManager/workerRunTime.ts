import { SignalSourceManager } from "../../application/types/signalSource";
import { DataManagerNaive } from "./dataManagerNaive";
import type { FetchDataRequest } from "./fetchDataRequest";
import type { ReceivedRequest } from "./receivedRequest";

export function buildWorkerRunTime(signalManager: SignalSourceManager) {
    let dataManager: DataManagerNaive | null = null
    const manager = signalManager
    self.onmessage = async (event: MessageEvent) => {
        const data = event.data
        if (data.type === 'init') {
            const signalsSourceBuildData = data.data as string
            manager.deSerialize(signalsSourceBuildData)
            dataManager = new DataManagerNaive(manager)
        }

        else {
            const { requestId, labels, viewPort, expectedWidth } = data as FetchDataRequest
            const signalsData = await dataManager!.fetchData(labels, {
                startSeconds: viewPort.startSeconds,
                lengthSeconds: viewPort.lengthSeconds
            }, expectedWidth)


            const response: ReceivedRequest = {
                requestId,
                signalsData
            }
            self.postMessage(response)
        }
    }
}
