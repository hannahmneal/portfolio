import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { MoonIcon, SunIcon } from '../components/Icons/ThemeIcons'
import { useAppTheme } from '../theme'

export function ThemeButton() {
    const theme = useTheme()
    const { button } = theme.custom
    const { colorMode, toggleMode } = useAppTheme()
    const isDark = colorMode === 'dark'

    return(
        <Box
            component="button"
            type="button"
            onClick={toggleMode}
            aria-pressed={isDark}
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
                color: button.text,
                boxShadow: button.shadow,
                cursor: 'pointer',
            }}
        >
            {isDark ? <SunIcon /> : <MoonIcon />}
            {isDark ? 'Light mode' : 'Dark mode'}
        </Box>
    )
}