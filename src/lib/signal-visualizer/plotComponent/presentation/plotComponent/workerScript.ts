import { SignalSourceManager } from '@/lib/signal-visualizer/plotComponent/application/interfaces/signalSource.ts'
import { buildWorkerRunTime } from '@/lib/signal-visualizer/plotComponent/core/dataManager/workerRunTime.ts'
import {
    MockSignalSerializer,
    MockSignalSourceFactory,
} from '@/lib/signal-visualizer/plotComponent/infrastructure/signals/mockSignalSource.ts'

const manager: SignalSourceManager = new SignalSourceManager()

const serializer = new MockSignalSerializer()
const factory = new MockSignalSourceFactory()

manager.addSerializer(serializer)
manager.addFactory(serializer.serializerId, factory)

buildWorkerRunTime(manager)
