// Design styles transcribed from docs/design-handoff/HANDOFF.md (sections 2 and 3).
// Keep this file in sync with the handoff doc if the design changes.

export const accentOptions = {
  red: '#C8102E',
  blue: '#2B4FD8',
  orange: '#C2410C',
  purple: '#6B3FA0',
}

export const defaultAccent = accentOptions.red

export const lightStyles = {
  text: '#1A1A1A',
  textMuted: '#3E3E3B',
  windowBg: '#EEEEEB',
  windowBorder: '#1A1A1A',
  windowShadow: 'inset 1px 1px 0 #FFFFFF, 4px 4px 0 rgba(26,26,26,0.35)',
  titleBarBg: '#E2E2DE',
  titlePinstripes: 'repeating-linear-gradient(#FFFFFF 0 1px, #9A9A96 1px 2px)',
  navBarBg: '#FFFFFF',
  navBarBorder: '#1A1A1A',
  navBarShadow: '0 3px 0 rgba(26,26,26,0.18)',
  navDivider: '#A8A8A4',
  navBarBoxIconShadow: '#1A1A1A',
  bannerBg: '#1A1A1A',
  bannerText: '#D9D9D4',
  buttonBg: '#EEEEEB',
  buttonBgDisabled: '#9A9A96',
  buttonGhostDisabled: '#90908c',
  buttonTextDisabled: '#3E3E3B',
  buttonBorderDisabled: '1px solid transparent',
  buttonBorder: '#1A1A1A',
  buttonPressedBg: '#5E5E5A',
  buttonPressedText: '#FFFFFF',
  buttonPressedShadow: 'inset 2px 2px 0 #2A2A28',
  themeButtonIcon: '#1A1A1A',
  sunkenBg: '#FFFFFF',  
  sunkenBorder: '#1A1A1A',
  sunkenShadow: 'inset 1px 1px 0 #9A9A96',
  link: '#1F3FBF',
  linkVisited: '#6B2C91',
  linkHoverText: '#FFFFFF',
  footerBg: '#E2E2DE',
  footerBorder: '#1A1A1A',
  footerShadow: 'inset 0 1px 0 #FFFFFF',
  footerPipe: '#6B6B66',
  footerPaneBg: '#EEEEEB',
  footerPaneBorder: '#9A9A96',
  footerPaneShadow: 'inset 1px 1px 0 #9A9A96, inset -1px -1px 0 #FFFFFF',
  footerDigitBg: '#1A1A1A',
  footerDigitText: '#FFFFFF',
  footerDigitBorder: 'none',
  footerLoadingBarBorder: '#1A1A1A',
  footerLoadingBarTrack: '#EEEEEB',
  hoverInvertBg: '#1A1A1A',
  hoverInvertText: '#FFFFFF',
}

export const darkStyles = {
  text: '#F3EFE6',
  textMuted: '#A7ADB4',
  windowBg: '#171A20',
  windowBorder: '#07080A',
  windowBorderRing: '0 0 0 1px #2E333B',
  windowShadow: 'inset 1px 1px 0 rgba(255,255,255,0.07), 5px 5px 0 rgba(0,0,0,0.55)',
  titleBarBg: '#1F232A',
  titleText: '#C9CDD3',
  titlePinstripes: 'repeating-linear-gradient(#2E333B 0 1px, #191C22 1px 2px)',
  navBarBg: '#1B1F26',
  navDivider: '#3A4048',
  navBarBoxIconShadow: '#1A1A1A',
  bannerBg: '#0B0D10',
  bannerText: '#8E959D',
  buttonBgDisabled: '#9A9A96',
  buttonTextDisabled: '#3E3E3B',
  buttonBorderDisabled: '1px solid transparent',
  buttonBg: '#2A2F37',
  buttonBorder: '#07080A',
  themeButtonIcon: '#C9CDD3',
  sunkenBg: '#0B0D10',
  sunkenBorder: '#3A4048',
  link: '#67E8F9',
  linkVisited: '#C9A7F2',
  linkHoverText: '#0B0D10',
  footerBg: '#1B1F26',
  footerBorder: '#07080A',
  footerShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
  footerPipe: '#6E747C',
  footerPaneBg: '#14171C',
  footerPaneBorder: '#07080A',
  footerPaneShadow: 'inset 1px 1px 0 #000000, inset -1px -1px 0 rgba(255,255,255,0.08)',
  footerDigitBg: '#0B0D10',
  footerDigitText: '#F3EFE6',
  footerDigitBorder: '1px solid #3A4048',
  footerLoadingBarBorder: '#07080A',
  footerLoadingBarTrack: '#262B33',
  hoverInvertBg: '#F3EFE6',
  hoverInvertText: '#0B0D10',
}

export const desktopBackgroundPatterns = {
  dither: {
    light: 'repeating-conic-gradient(#A3AEBA 0% 25%, #C9D0D8 0% 50%) 0 0 / 4px 4px',
    dark: 'repeating-conic-gradient(#0F1216 0% 25%, #171B21 0% 50%) 0 0 / 4px 4px',
  },
  grid: {
    light:
      'linear-gradient(#A3AEBA 1px, transparent 1px) 0 0 / 14px 14px, linear-gradient(90deg, #A3AEBA 1px, #C9D0D8 1px) 0 0 / 14px 14px',
    dark:
      'linear-gradient(rgba(243,239,230,0.05) 1px, transparent 1px) 0 0 / 28px 28px, linear-gradient(90deg, rgba(243,239,230,0.05) 1px, #0E1013 1px) 0 0 / 28px 28px',
  },
  diagonal: {
    light: 'repeating-linear-gradient(45deg, #A3AEBA 0 2px, #C9D0D8 2px 7px)',
    dark: 'repeating-linear-gradient(45deg, #171B21 0 2px, #0E1013 2px 9px)',
  },
  halftone: {
    light: 'radial-gradient(#9AA5B2 1.3px, transparent 1.6px) 0 0 / 12px 12px, #C9D0D8',
    dark: 'radial-gradient(rgba(243,239,230,0.09) 1.2px, transparent 1.5px) 0 0 / 14px 14px, #0E1013',
  },
  solid: {
    light: '#BCC5CF',
    dark: '#0E1013',
  },
}

export const defaultPattern = {
  light: 'dither',
  dark: 'grid',
}
