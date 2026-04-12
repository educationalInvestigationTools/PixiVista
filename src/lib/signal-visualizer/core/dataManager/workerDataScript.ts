import type { SignalSourceBuildData } from "../../application/types/signalSource";
import { DataManagerNaive } from "./dataManagerNaive";
import type { FetchDataRequest } from "./fetchDataRequest";
import type { ReceivedRequest } from "./receivedRequest";

let dataManager: DataManagerNaive | null = null

self.onmessage = async (event: MessageEvent) => {
    const data = event.data
    if (data.type === 'init') {
        const signalsSourceBuildData = data.data as SignalSourceBuildData[]
        dataManager = new DataManagerNaive(signalsSourceBuildData)
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
