import { SignalSourceManager} from "../../application/types/signalSource";
import { MockSignalSerializer, MockSignalSourceFactory } from "../../infrastructure/signals/mockSignalSource";
import { DataManagerNaive } from "./dataManagerNaive";
import type { FetchDataRequest } from "./fetchDataRequest";
import type { ReceivedRequest } from "./receivedRequest";

let dataManager: DataManagerNaive | null = null

self.onmessage = async (event: MessageEvent) => {
    const data = event.data
    if (data.type === 'init') {
        const signalsSourceBuildData = data.data as string

        const factory = new MockSignalSourceFactory()
        const serializer = new MockSignalSerializer()

        const signalSourceManager = new SignalSourceManager()
        signalSourceManager.addSerializer(serializer)
        signalSourceManager.addFactory(serializer.serializerId, factory)
        signalSourceManager.deSerialize(signalsSourceBuildData)
        dataManager = new DataManagerNaive(signalSourceManager)
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
