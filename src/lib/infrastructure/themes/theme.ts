export const themes = {
    dark: {
        panelBg: '#000000',
        panelRowBg: '#0b0b0b',
        panelSurface: '#0f0f0f',
        panelBorder: '#2a2a2a',
        textPrimary: '#ffffff',
        textMuted: '#9a9a9a',
        textInverse: '#000000',
        focusColor: '#ffffff',
        trackGridDark: '#1e1e1e',
        trackGridLight: '#0b0b0b',
        hoverBg: '#111111',
        iconFilter: 'brightness(0) invert(1)',
    } as const,
    light: {
        panelBg: '#ffffff',
        panelRowBg: '#f5f5f5',
        panelSurface: '#f0f0f0',
        panelBorder: '#d0d0d0',
        textPrimary: '#111111',
        textMuted: '#555555',
        textInverse: '#ffffff',
        focusColor: '#111111',
        trackGridDark: '#dcdcdc',
        trackGridLight: '#f5f5f5',
        hoverBg: '#e8e8e8',
        iconFilter: 'none',
    } as const,
} as const

export type ThemeName = keyof typeof themes
export type ThemeColors = {
    [K in keyof typeof themes['dark']]: string
}
