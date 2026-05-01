import { RenderLayerDomainApi } from "@/core/rendering/layerApi"
import { ChangeChannelVisibilityCommand, ChangeChannelVisibilityCommandEventLabel } from "@/plotComponent/application/commands/changeChannelVisibilityCommand"
import type { OneDimNormalizedSignal } from "@/plotComponent/application/types/oneDimNormalizedSignal"
import { PlotComponentLayer } from "@/plotComponent/infrastructure/rendering/plotComponentLayer/plotComponentLayer"
import type { EventMediator } from "@/utils/eventMediator"

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
