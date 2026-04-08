import type { SignalSourceBuildData } from "../../application/types/signalSource";
import type { ViewPort } from "../../application/types/viewPort";
import type { OneDimNormalizedSignal } from "../types";
import { DataManager } from "./dataManager";
import type { FetchDataRequest } from "./fetchDataRequest";
import type { ReceivedRequest } from "./receivedRequest";



export class DataManagerWorker extends DataManager {
    worker: Worker;
    pendingRequests: Map<string, (value: OneDimNormalizedSignal[]) => void> = new Map();

    constructor(signalsSourceBuildData: SignalSourceBuildData[]) {
        super(signalsSourceBuildData);
        this.worker = new Worker(
            new URL('./workerDataScript.ts', import.meta.url),
            { type: 'module' }
        );
        this.worker.onmessage = this.handleWorkerMessage.bind(this);
        this.worker.postMessage({ type: 'init', data: signalsSourceBuildData })
    }

    fetchData(labels: string[], viewPort: ViewPort, expectedWidth: number): Promise<OneDimNormalizedSignal[]> {

        const requestId = crypto.randomUUID();
        const promise = new Promise<OneDimNormalizedSignal[]>(
            (resolve) => {
                this.pendingRequests.set(requestId, resolve);
            }
        );
        this.worker.postMessage({
            requestId,
            labels: labels,
            viewPort: {
                startSeconds: viewPort.startSeconds,
                lengthSeconds: viewPort.lengthSeconds
            },
            expectedWidth: expectedWidth
        } satisfies FetchDataRequest);

        return promise;
    }

    private handleWorkerMessage(event: MessageEvent<ReceivedRequest>) {
        const { requestId, signalsData } = event.data;
        const resolve = this.pendingRequests.get(requestId);
        if (resolve) {
            resolve(signalsData);
            this.pendingRequests.delete(requestId);
        }
    }
}
