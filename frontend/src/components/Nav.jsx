import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { NavLink } from 'react-router'
import { ThemeButton } from '../components/Buttons'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/work', label: 'Work' },
  { to: '/now', label: 'Now' },
]

export default function Nav() {
  const theme = useTheme()
  const { navBar, hoverInvert } = theme.custom
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
        minHeight: navBar.minHeight,
        bgcolor: navBar.bg,
        borderBottom: `2px solid ${navBar.border}`,
        boxShadow: navBar.shadow,
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
          padding: '9px 14px',
          borderRadius: '4px',
          '&:hover, &:focus-visible': {
            bgcolor: hoverInvert.bg,
            color: hoverInvert.text,
            outline: 'none',
          },
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            width: 20,
            height: 20,
            bgcolor: accent,
            border: `1px solid ${navBar.boxIconShadow}`,
            boxShadow: `2px 2px 0 ${navBar.boxIconShadow}`,
          }}
        />
        H.Neal
      </Box>

      <Box
        aria-hidden="true"
        sx={{ width: '1px', height: '26px', mx: '8px', bgcolor: navBar.divider }}
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
            color: text,
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
          <Box
            aria-hidden="true"
            sx={{
              width: 8,
              height: 8,
              bgcolor: accent,
              border: `1px solid ${navBar.boxIconShadow}`,
              '@keyframes pc-blink': { '50%': { opacity: 0 } },
              animation: 'pc-blink 1s steps(1) infinite',
            }}
          />
          ONLINE &middot; 2026
        </Box>
        <ThemeButton/>
      </Box>
    </Box>
  )
}
