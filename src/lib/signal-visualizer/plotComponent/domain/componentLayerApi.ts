import { RenderLayerDomainApi } from '@/lib/signal-visualizer/core/rendering/layerApi.ts'
import { ComponentLayer } from '../infrastructure/rendering/componentLayer/componentLayer.ts'
import {
    ChangeChannelVisibilityCommandEventLabel,
    type ChangeChannelVisibilityCommand,
} from '@/lib/signal-visualizer/plotComponent/application/commands/changeChannelVisibilityCommand.ts'
import type { EventMediator } from '@/lib/signal-visualizer/utils/eventMediator.ts'

import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { OneDimNormalizedSignal } from '@/lib/signal-visualizer/plotComponent/application/types/oneDimNormalizedSignal.ts'
import { ComponentLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/componentLayer/componentLayout.ts'

export class ComponentLayerLogicApi extends RenderLayerDomainApi<ComponentLayer> {

    get VisibleChannels() {
        return this.component.channelsLayer.activeChannels!
    }

    constructor(
        sizeData: SizeData,
        labels: string[],
        eventMediator: EventMediator,
    ) {
        const componentLayer = new ComponentLayer(
            new ComponentLayout(sizeData, {
                x: 0,
                y: 0,
            }),
            labels,
        )

        super(componentLayer, eventMediator)
    }

    private addChannel(label: string) {
        this.component.channelsLayer.addChannel(label)
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
