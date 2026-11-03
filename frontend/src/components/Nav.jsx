import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { NavLink } from 'react-router'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/work', label: 'Work' },
  { to: '/now', label: 'Now' },
]

export default function Nav() {
  const theme = useTheme()
  const { menuBar, link, hoverInvert, button, titleBar } = theme.custom
  const accent = theme.palette.primary.main
  const text = theme.palette.text.primary

  return (
    <Box
      component="nav"
      aria-label="Main"
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '4px',
        padding: '6px 16px',
        minHeight: menuBar.minHeight,
        bgcolor: menuBar.bg,
        borderBottom: `2px solid ${menuBar.border}`,
        boxShadow: menuBar.shadow,
      }}
    >
      <Box
        component={NavLink}
        to="/"
        end
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          fontFamily: theme.typography.h3.fontFamily,
          fontWeight: 700,
          fontSize: '20px',
          textDecoration: 'none',
          color: text,
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            width: 20,
            height: 20,
            bgcolor: accent,
            border: `1px solid ${text}`,
            boxShadow: `2px 2px 0 ${text}`,
          }}
        />
        H.Neal
      </Box>

      <Box
        aria-hidden="true"
        sx={{ width: '1px', height: '26px', mx: '8px', bgcolor: menuBar.divider }}
      />

      {NAV_LINKS.map(({ to, label }) => (
        <Box
          key={to}
          component={NavLink}
          to={to}
          end={to === '/'}
          sx={{
            fontFamily: theme.typography.fontFamily,
            fontWeight: 600,
            fontSize: '15px',
            textDecoration: 'none',
            padding: '9px 14px',
            borderRadius: '4px',
            color: link.color,
            '&:visited': {
              color: link.visited,
            },
            '&[aria-current="page"], &:hover, &:focus-visible': {
              bgcolor: hoverInvert.bg,
              color: hoverInvert.text,
              outline: 'none',
            },
          }}
        >
          {label}
        </Box>
      ))}

      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: theme.typography.subtitle1.fontFamily,
            fontSize: '12px',
            color: text,
          }}
        >
          {/* TODO: 11/2/26: Non-functional; Static.  */}
          <Box
            aria-hidden="true"
            sx={{
              width: 8,
              height: 8,
              bgcolor: accent,
              border: `1px solid ${text}`,
              '@keyframes pc-blink': { '50%': { opacity: 0 } },
              animation: 'pc-blink 1s steps(1) infinite',
            }}
          />
          ONLINE &middot; 2026
        </Box>

        <Box
          component="button"
          type="button"
          aria-pressed={false}
          sx={{
            fontFamily: theme.typography.button.fontFamily,
            fontWeight: theme.typography.button.fontWeight,
            fontSize: '13px',
            minHeight: 40,
            padding: '0 14px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            borderRadius: '7px',
            border: `1px solid ${button.border}`,
            bgcolor: button.bg,
            color: text,
            boxShadow: button.shadow,
            cursor: 'pointer',
          }}
        >
          {/* Dark darkmode icon (moon)👇🏻 */}
          {/* TODO: #38 */}
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            shapeRendering="crispEdges"
          >
            <rect x="5" y="1" width="5" height="2" fill={titleBar.text} />
            <rect x="3" y="3" width="4" height="2" fill={titleBar.text} />
            <rect x="2" y="5" width="4" height="6" fill={titleBar.text} />
            <rect x="3" y="11" width="4" height="2" fill={titleBar.text} />
            <rect x="5" y="13" width="7" height="2" fill={titleBar.text} />
            <rect x="11" y="11" width="3" height="2" fill={titleBar.text} />
          </svg>
          Dark mode
        </Box>
      </Box>
    </Box>
  )
}
