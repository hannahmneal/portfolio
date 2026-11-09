import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { NavLink } from 'react-router'

// 👇🏻 "Back to top" is a plain anchor to the #top target, not a route.
const FOOTER_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/work', label: 'Work' },
  { to: '/now', label: 'Now' },
  { to: '/guestbook', label: 'Guestbook' },
]

const VISITOR_COUNT = '001337'
const LAST_UPDATED = '2026'

export default function Footer() {
  const theme = useTheme()
  const { footer, hoverInvert } = theme.custom
  const accent = theme.palette.primary.main
  const text = theme.palette.text.primary
  const muted = theme.palette.text.secondary

  // Shared look for both the routed links and the "Back to top" anchor.
  const linkSx = {
    fontFamily: theme.typography.fontFamily,
    fontWeight: 600,
    fontSize: '14px',
    textDecoration: 'none',
    display: 'inline-block',
    padding: '8px 10px',
    borderRadius: '3px',
    color: text,
    '&[aria-current="page"], &:hover, &:focus-visible': {
      bgcolor: hoverInvert.bg,
      color: hoverInvert.text,
      outline: 'none',
    },
  }

  // A sunken status pane. Row 2 is a strip of these.
  const paneSx = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    minHeight: footer.pane.minHeight,
    border: `1px solid ${footer.pane.border}`,
    bgcolor: footer.pane.bg,
    boxShadow: footer.pane.shadow,
    fontFamily: theme.typography.caption.fontFamily,
    fontSize: '12px',
    color: text,
  }

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        borderTop: `2px solid ${footer.border}`,
        bgcolor: footer.bg,
        boxShadow: footer.shadow,
        color: text,
      }}
    >
      <Box
        sx={{
          maxWidth: footer.maxWidth,
          mx: 'auto',
          padding: '22px 24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* Row 1: logo, copyright, pipe-separated links */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px 24px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Box
              aria-hidden="true"
              sx={{
                width: 18,
                height: 18,
                bgcolor: accent,
                border: `1px solid ${footer.boxIconShadow}`,
                boxShadow: `2px 2px 0 ${footer.boxIconShadow}`,
              }}
            />
            <Box
              component="span"
              sx={{
                fontFamily: theme.typography.h3.fontFamily,
                fontWeight: 700,
                fontSize: '18px',
              }}
            >
              H.Neal
            </Box>
            <Box
              component="span"
              sx={{
                fontFamily: theme.typography.caption.fontFamily,
                fontSize: '12px',
                color: muted,
              }}
            >
              &copy; 2026
            </Box>
          </Box>

          <Box
            component="nav"
            aria-label="Footer"
            sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2px' }}
          >
            {FOOTER_LINKS.map(({ to, label }) => (
              <Box key={to} sx={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                <Box component={NavLink} to={to} end={to === '/'} sx={linkSx}>
                  {label}
                </Box>
                <Box
                  component="span"
                  aria-hidden="true"
                  sx={{
                    fontFamily: theme.typography.caption.fontFamily,
                    fontSize: '14px',
                    color: footer.pipe,
                  }}
                >
                  |
                </Box>
              </Box>
            ))}
            <Box component="a" href="#top" sx={linkSx}>
              Back to top &#9652;
            </Box>
          </Box>
        </Box>

        {/* Row 2: the status bar */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          <Box component="span" sx={paneSx}>
            <Box
              aria-hidden="true"
              sx={{
                width: 9,
                height: 9,
                bgcolor: accent,
                border: `1px solid ${footer.boxIconShadow}`,
                '@keyframes pc-blink': { '50%': { opacity: 0 } },
                animation: 'pc-blink 1s steps(1) infinite',
              }}
            />
            Status: online & sleepy
          </Box>

          <Box component="span" sx={paneSx}>
            Last updated: {LAST_UPDATED}
          </Box>

          <Box component="span" sx={paneSx}>
            Visitors
            {/* The tiles are decorative; the count is announced once via the label. */}
            <Box
              component="span"
              aria-label={VISITOR_COUNT}
              sx={{ display: 'inline-flex', gap: '2px' }}
            >
              {VISITOR_COUNT.split('').map((digit, i) => (
                <Box
                  key={i}
                  component="span"
                  aria-hidden="true"
                  sx={{
                    width: 22,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: theme.typography.subtitle1.fontFamily,
                    fontSize: '15px',
                    borderRadius: '2px',
                    bgcolor: footer.digit.bg,
                    color: footer.digit.text,
                    border: footer.digit.border,
                  }}
                >
                  {digit}
                </Box>
              ))}
            </Box>
          </Box>

          <Box component="span" sx={paneSx}>
            Loading
            <Box
              aria-hidden="true"
              sx={{
                width: 110,
                height: 14,
                border: `1px solid ${footer.loadingBar.border}`,
                borderRadius: '3px',
                background: `repeating-linear-gradient(-45deg, ${accent} 0 8px, ${footer.loadingBar.track} 8px 16px)`,
                '@keyframes pc-loadingBar': {
                  '0%': { backgroundPosition: '0 0' },
                  '100%': { backgroundPosition: '22.63px 0' },
                },
                animation: 'pc-loadingBar 0.8s linear infinite',
              }}
            />
          </Box>

          <Box component="span" sx={{ ...paneSx, flex: '1 1 200px' }}>
            Made with 🥐, ☕️, 🎧, and ❤️.
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
