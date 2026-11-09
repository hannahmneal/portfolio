import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const BANNER_MESSAGE = 'WELCOME!'
const SEPARATOR = '▪' // ▪

// 👇🏻 One copy of the strip. Two sit side by side and the pair slides by -50%
const REPEATS = 7

const stripText = Array.from({ length: REPEATS }, () => `${BANNER_MESSAGE} ${SEPARATOR}`).join(' ')

export default function Banner() {
  const theme = useTheme()
  const { banner } = theme.custom

  const stripSx = {
    fontFamily: theme.typography.subtitle1.fontFamily,
    fontSize: `${banner.fontSize}px`,
    whiteSpace: 'nowrap',
    paddingRight: '32px',
    color: banner.text,
  }

  return (
    // The marquee is pure decoration, so the whole strip is hidden from
    // assistive tech rather than read out seven times.
    <Box
      aria-hidden="true"
      sx={{
        overflow: 'hidden',
        padding: `${banner.paddingY}px 0`,
        bgcolor: banner.bg,
        borderBottom: banner.borderBottom,
      }}
    >
      <Box
        data-testid="banner-marquee"
        sx={{
          display: 'flex',
          width: 'max-content',
          '@keyframes pc-marquee': {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(-50%)' },
          },
          animation: `pc-marquee ${banner.duration} linear infinite`,
          // Endless horizontal motion is a vestibular trigger, so park it.
          '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
        }}
      >
        <Box component="span" sx={stripSx}>
          {stripText}
        </Box>
        <Box component="span" sx={stripSx}>
          {stripText}
        </Box>
      </Box>
    </Box>
  )
}
