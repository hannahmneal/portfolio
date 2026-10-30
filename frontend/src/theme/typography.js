export const fontFamilies = {
  pixelify: '"Pixelify Sans", sans-serif',
  silkscreen: '"Silkscreen", sans-serif',
  plexSans: '"IBM Plex Sans", sans-serif',
  plexMono: '"IBM Plex Mono", monospace',
}

export const typography = {
  fontFamily: fontFamilies.plexSans,
  h1: {
    fontFamily: fontFamilies.pixelify,
    fontWeight: 700,
    fontSize: 'clamp(36px, 5.4vw, 60px)',
    lineHeight: 1.1,
  },
  h2: {
    fontFamily: fontFamilies.pixelify,
    fontWeight: 700,
    fontSize: '28px',
    lineHeight: 1.2,
  },
  h3: {
    fontFamily: fontFamilies.pixelify,
    fontWeight: 700,
    fontSize: '20px',
    lineHeight: 1.25,
  },
  subtitle1: {
    fontFamily: fontFamilies.silkscreen,
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: 1.4,
    letterSpacing: '0.02em',
  },
  body1: {
    fontFamily: fontFamilies.plexSans,
    fontWeight: 400,
    fontSize: '17px',
    lineHeight: 1.5,
  },
  body2: {
    fontFamily: fontFamilies.plexSans,
    fontWeight: 400,
    fontSize: '15px',
    lineHeight: 1.5,
  },
  button: {
    fontFamily: fontFamilies.plexSans,
    fontWeight: 600,
    fontSize: '14px',
    textTransform: 'none',
  },
  caption: {
    fontFamily: fontFamilies.plexMono,
    fontWeight: 400,
    fontSize: '13px',
    lineHeight: 1.4,
  },
  overline: {
    fontFamily: fontFamilies.plexMono,
    fontWeight: 500,
    fontSize: '12px',
    letterSpacing: '0.04em',
    textTransform: 'none',
  },
}
