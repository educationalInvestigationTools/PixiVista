import { themes, type ThemeName, type ThemeColors } from "@/infrastructure/themes/theme"

class ThemeManager {
    private _current: ThemeName


    getSystemTheme(): ThemeName {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
        return 'dark';
    }
    get colors(): ThemeColors {
        return themes[this._current]
    }

    setTheme(name: ThemeName) {
        this._current = name
        this.applyToDOM()
        const event = new CustomEvent('themechanged', {
            detail: { theme: this._current }
        })
        window.dispatchEvent(event)
    }

    private applyToDOM() {
        const root = document.documentElement
        const colors = this.colors
        for (const [key, value] of Object.entries(colors)) {
            const keyProcessed = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
            root.style.setProperty(`--ui-${keyProcessed}`, value);
        }
        root.setAttribute('data-theme', this._current);
        root.style.setProperty("--ui-font", '"Inter", system-ui, sans-serif')
        root.style.setProperty('--ui-font-mono', 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace')
    }
    constructor() {
        this._current = this.getSystemTheme()
        this.applyToDOM()
    }

    get CurrentTheme() {
        return this._current
    }
}

export const themeManager = new ThemeManager();
