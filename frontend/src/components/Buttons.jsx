import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { MoonIcon, SunIcon } from '../components/Icons/ThemeIcons'
import { useAppTheme } from '../theme'

function clickFn() { (console.log("I've been pressed!")) }

// Default button. Icon, label, state, and function can be passed to it.
export function Button({
    icon = null,
    onClickFn,
    state = null,
    children = null,
}) {
    const theme = useTheme()
    const { button } = theme.custom

    return (
        <Box
            component="button"
            type="button"
            onClick={onClickFn}
            aria-pressed={state}
            sx={{
                fontFamily: theme.typography.button.fontFamily,
                fontWeight: theme.typography.button.fontWeight,
                fontSize: theme.typography.button.fontSize,
                minHeight: 44,
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
            {icon}
            {children}
        </Box>
    )
}

export function ButtonPrimary({
    icon = null,
    onClickFn,
    state = null,
    children = null,
}) {
    const theme = useTheme()
    const { button } = theme.custom

    return (
        <Box
            className="button_container"
            sx={{
                
            }}
        >
            <Box
                component="button"
                type="button"
                onClick={onClickFn}
                aria-pressed={state}
                sx={{
                    fontFamily: theme.typography.button.fontFamily,
                    fontWeight: theme.typography.button.fontWeight,
                    fontSize: theme.typography.button.fontSize,
                    minHeight: 44,
                    padding: '0 14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderRadius: '7px',
                    border: `1px solid ${button.border}`,
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    boxShadow: button.shadow,
                    cursor: 'pointer',
                }}
                >
                {icon}
                {children}
            </Box>
        </Box>
    )
}

export function ThemeButton() {
    const theme = useTheme()
    const { button } = theme.custom
    const { colorMode, toggleMode } = useAppTheme()
    const isDark = colorMode === 'dark'

    return (
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