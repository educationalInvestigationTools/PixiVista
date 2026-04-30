import { RenderLayerDomainApi } from '@/lib/signal-visualizer/core/rendering/layerApi.ts'

import {
    ChangeChannelVisibilityCommandEventLabel,
    type ChangeChannelVisibilityCommand,
} from '@/lib/signal-visualizer/plotComponent/application/commands/changeChannelVisibilityCommand.ts'
import type { EventMediator } from '@/lib/signal-visualizer/utils/eventMediator.ts'

import type { OneDimNormalizedSignal } from '@/lib/signal-visualizer/plotComponent/application/types/oneDimNormalizedSignal.ts'
import { PlotComponentLayer } from '../infrastructure/rendering/plotComponentLayer/plotComponentLayer'

export class ComponentLayerLogicApi extends RenderLayerDomainApi<PlotComponentLayer> {

    get VisibleChannels() {
        return this.component.channelsLayer.labelsVisibleChannels!
    }

    constructor(
        labels: string[],
        eventMediator: EventMediator,
    ) {
        const componentLayer = new PlotComponentLayer(
            labels,
        )

        super(componentLayer, eventMediator)
    }

    private addChannel(label: string) {
        this.component.channelsLayer.addChannels([label])
    }

    private removeChannel(label: string) {
        this.component.channelsLayer.removeChannel(label)
    }

    private async changeChannelVisibility(command: ChangeChannelVisibilityCommand) {
        if (!command.visibility) {
            this.removeChannel(command.channelLabel)
        } else {
            this.addChannel(command.channelLabel)
        }
    }

    async updateSignalData(signals: OneDimNormalizedSignal[]) {
        this.component!.updateSignalsData(signals)
    }

    registerEvents(): void {
        this.eventMediator.addHandler<ChangeChannelVisibilityCommand>(
            ChangeChannelVisibilityCommandEventLabel,
            async (command) => this.changeChannelVisibility(command),
        )
    }
}
