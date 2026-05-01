import { SignalSourceManager } from "@/plotComponent/application/interfaces/signalSource"
import { buildWorkerRunTime } from "@/plotComponent/domain/dataManager/workerRunTime"
import { MockSignalSerializer, MockSignalSourceFactory } from "@/plotComponent/infrastructure/signals/mockSignalSource"


const manager: SignalSourceManager = new SignalSourceManager()

const serializer = new MockSignalSerializer()
const factory = new MockSignalSourceFactory()

manager.addSerializer(serializer)
manager.addFactory(serializer.serializerId, factory)

buildWorkerRunTime(manager)
