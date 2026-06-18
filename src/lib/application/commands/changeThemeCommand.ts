import type { ThemeName } from '@/infrastructure/themes/theme'
import type { EventToMediate } from '@/utils/eventMediator.ts'

export const ChangeThemeCommandLabel = "ChangeThemeCommandLabel"

export class ChangeThemeCommand implements EventToMediate {
    eventLabel: string = ChangeThemeCommandLabel
    theme: ThemeName

    constructor(theme : ThemeName) {
        this.theme = theme
    }
}
