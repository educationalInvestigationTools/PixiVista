import { RenderLayerDomainApi } from '@/lib/signal-visualizer/core/rendering/layerApi.ts'
import { ComponentLayer } from '../infrastructure/rendering/componentLayer/componentLayer.ts'
import {
    ChangeChannelVisibilityCommandEventLabel,
    type ChangeChannelVisibilityCommand,
} from '@/lib/signal-visualizer/plotComponent/application/commands/changeChannelVisibilityCommand.ts'
import type { ViewPort } from '@/lib/signal-visualizer/plotComponent/application/types/viewPort.ts'
import type { EventMediator } from '@/lib/signal-visualizer/utils/eventMediator.ts'
import {
    ChangeViewPortCommandEventLabel,
    type ChangeViewPortCommand,
} from '@/lib/signal-visualizer/plotComponent/application/commands/changeViewPortCommand.ts'

import type { MinMaxValues } from '@/lib/signal-visualizer/plotComponent/application/types/minMaxValues.ts'
import type { SizeData } from '@/lib/signal-visualizer/core/types/sizeData.ts'
import type { OneDimNormalizedSignal } from '@/lib/signal-visualizer/plotComponent/application/types/oneDimNormalizedSignal.ts'
import { ComponentLayout } from '@/lib/signal-visualizer/plotComponent/infrastructure/rendering/componentLayer/componentLayout.ts'

export class ComponentLayerLogicApi extends RenderLayerDomainApi<ComponentLayer> {
    private viewPort: ViewPort

    private static transformViewPort(viewPort: ViewPort): MinMaxValues {
        return {
            min: viewPort.startSeconds,
            max: viewPort.startSeconds + viewPort.lengthSeconds,
        }
    }

    get ViewPort() {
        return this.viewPort
    }

    get VisibleChannels() {
        return this.component.channelsLayer.activeChannels!
    }

    constructor(
        sizeData: SizeData,
        labels: string[],
        viewPort: ViewPort,
        eventMediator: EventMediator,
    ) {
        const gridData = {
            verticalDivisions: 10,
            horizontalDivisions: 5,
        }

        const minMaxValues = ComponentLayerLogicApi.transformViewPort(viewPort)
        const componentLayer = new ComponentLayer(
            new ComponentLayout(sizeData, {
                x: 0,
                y: 0,
            }),
            minMaxValues,
            gridData.verticalDivisions,
            labels,
        )

        super(componentLayer, eventMediator)
        this.viewPort = viewPort
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

    private async changeViewPort(command: ChangeViewPortCommand): Promise<void> {
        this.viewPort = command.viewPort
    }

    async updateSignalData(signals: OneDimNormalizedSignal[]) {
        const minMaxValues = ComponentLayerLogicApi.transformViewPort(this.viewPort)
        this.component!.updateSignalsData(signals, minMaxValues)
    }

    registerEvents(): void {
        this.eventMediator.addHandler<ChangeChannelVisibilityCommand>(
            ChangeChannelVisibilityCommandEventLabel,
            async (command) => this.changeChannelVisibility(command),
        )

        this.eventMediator.addHandler<ChangeViewPortCommand>(
            ChangeViewPortCommandEventLabel,
            async (command) => this.changeViewPort(command),
        )
    }
}
