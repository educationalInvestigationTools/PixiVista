import type {EventToMediate} from '@/utils/eventMediator.ts'

export const ChangeChannelVisibilityCommandEventLabel = "ChangeChannelVisibilityCommand"

export class ChangeChannelVisibilityCommand implements EventToMediate {
    eventLabel: string = ChangeChannelVisibilityCommandEventLabel
    channelLabel: string
    visibility: boolean

    constructor(channelLabel: string, visibility: boolean) {
        this.channelLabel = channelLabel
        this.visibility = visibility
    }
}
