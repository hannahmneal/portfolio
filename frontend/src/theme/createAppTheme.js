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
    pressedBg: styles.buttonPressedBg,
    pressedText: styles.buttonPressedText,
    pressedShadow: styles.buttonPressedShadow,
    text: styles.text,
    minHeight: 44,
    disabledBg: styles.buttonBgDisabled,
    disabledText: styles.buttonTextDisabled,
    disabledBorder: styles.buttonBorderDisabled,
    ghostDisabled: styles.buttonGhostDisabled,
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
    shadow: styles.footerShadow,
    pipe: styles.footerPipe,
    boxIconShadow: styles.navBarBoxIconShadow,
    pane: {
      bg: styles.footerPaneBg,
      border: styles.footerPaneBorder,
      shadow: styles.footerPaneShadow,
      minHeight: 38,
    },
    digit: {
      bg: styles.footerDigitBg,
      text: styles.footerDigitText,
      border: styles.footerDigitBorder,
    },
    barber: {
      border: styles.footerBarberBorder,
      track: styles.footerBarberTrack,
    },
    maxWidth: 1180,
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
        // 👇🏻 The primary button has a thick "ring" around it which comes from the latter half of this string. The secondary button does not have this ring.
        buttonShadow: 'inset 1px 1px 0 rgba(255,255,255,0.4), inset -1px -2px 0 rgba(0,0,0,0.3), 0 0 0 3px #EEEEEB, 0 0 0 5px #1A1A1A',
      },
      secondary: {
        main: '#2A2F37',
        buttonShadow: 'inset 1px 1px 0px rgba(255,255,255,0.14), inset -1px -2px 0px rgba(0,0,0,0.55)',
      },
    },
    typography,
    shape: {
      borderRadius: 6,
    },
    custom: buildCustom(mode, styles),
  })
}
