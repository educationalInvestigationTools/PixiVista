import { SignalSourceManager } from "../../application/types/signalSource";
import { buildWorkerRunTime } from "../../core/dataManager/workerRunTime";
import { MockSignalSerializer, MockSignalSourceFactory } from "../../infrastructure/signals/mockSignalSource";

const manager: SignalSourceManager = new SignalSourceManager()

const serializer = new MockSignalSerializer()
const factory = new MockSignalSourceFactory()

manager.addSerializer(serializer)
manager.addFactory(serializer.serializerId, factory)

buildWorkerRunTime(
    manager
)
