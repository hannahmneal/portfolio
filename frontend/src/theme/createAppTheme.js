import { createTheme } from '@mui/material/styles'
import { lightStyles, darkStyles, desktopBackgroundPatterns, defaultPattern, defaultAccent } from './styles'
import { typography } from './typography'

const buildCustom = (mode, styles) => ({
  patterns: desktopBackgroundPatterns,
  pattern: defaultPattern[mode],
  window: {
    bg: styles.windowBg,
    border: styles.windowBorder,
    borderRadius: 1,
    borderRing: styles.windowBorderRing,
    margin: 24,
    shadow: styles.windowShadow,
  },
  titleBar: {
    bg: styles.titleBarBg,
    text: styles.titleText ?? styles.text,
    pinstripes: styles.titlePinstripes,
    height: 26,
    boxSize: 13,
  },
  navBar: {
    bg: styles.navBarBg,
    border: styles.navBarBorder,
    shadow: styles.navBarShadow,
    divider: styles.navDivider,
    boxIconShadow: styles.navBarBoxIconShadow,
    minHeight: 56,
  },
  banner: {
    bg: styles.bannerBg,
    text: styles.bannerText,
  },
  button: {
    bg: styles.buttonBg,
    border: styles.buttonBorder,
    shadow: styles.buttonShadow,
    pressedBg: styles.buttonPressedBg,
    pressedText: styles.buttonPressedText,
    pressedShadow: styles.buttonPressedShadow,
    text: styles.text,
    minHeight: 44,
  },
  sunken: {
    bg: styles.sunkenBg,
    border: styles.sunkenBorder,
    shadow: styles.sunkenShadow,
  },
  link: {
    color: styles.link,
    visited: styles.linkVisited,
    hoverText: styles.linkHoverText,
  },
  footer: {
    bg: styles.footerBg,
    border: styles.footerBorder,
  },
  hoverInvert: {
    bg: styles.hoverInvertBg,
    text: styles.hoverInvertText,
  },
})

export function createAppTheme(mode = 'light', accent = defaultAccent) {
  const styles = mode === 'dark' ? darkStyles : lightStyles

  return createTheme({
    cssVariables: false,
    palette: {
      mode,
      text: {
        primary: styles.text,
        secondary: styles.textMuted,
      },
      divider: styles.windowBorder,
      background: {
        default: desktopBackgroundPatterns.solid[mode],
        paper: styles.windowBg,
      },
      primary: {
        main: accent,
        contrastText: '#FFFFFF',
      },
    },
    typography,
    shape: {
      borderRadius: 6,
    },
    custom: buildCustom(mode, styles),
  })
}
