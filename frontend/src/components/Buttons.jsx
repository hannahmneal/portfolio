import { styled } from '@mui/material/styles'

import { MoonIcon, SunIcon } from '../components/Icons/ThemeIcons'
import { useAppTheme } from '../theme'

// Selectors shared by every variant, so overrides in `sx` use the exact same keys.
const HOVER = '&:hover:not(:disabled)'
const PRESSED = '&:active:not(:disabled), &[aria-pressed="true"]:not(:disabled)'
const DISABLED = '&:disabled'

const BaseButtonStyles = styled('button')(({ theme }) => {
    const { button } = theme.custom
    return {
        fontFamily: theme.typography.button.fontFamily,
        fontWeight: theme.typography.button.fontWeight,
        fontSize: theme.typography.button.fontSize,
        minHeight: 44,
        padding: '0 14px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        borderRadius: 7,
        border: `1px solid ${button.border}`,
        backgroundColor: button.bg,
        color: button.text,
        boxShadow: button.shadow,
        cursor: 'pointer',
        [HOVER]: { filter: 'brightness(1.12)' },
        [PRESSED]: {
            backgroundColor: button.pressedBg,
            color: button.pressedText,
            boxShadow: button.pressedShadow,
        },
        [DISABLED]: {
            border: button.disabledBorder,
            backgroundColor: button.disabledBg,
            color: button.disabledText,
            boxShadow: 'none',
            cursor: 'not-allowed',
        },
    }
})

function ButtonBase({
    icon = null,
    pressed,
    children = null,
    ...props
}) {
    return (
        <BaseButtonStyles
        type="button"
        aria-pressed={pressed}  // `aria-pressed={false}` would make screen readers announce a toggle button.
            {...props}
        >
            {icon}
            {children}
        </BaseButtonStyles>
    )
}

export function PrimaryButton(props) {
    return (
        <ButtonBase
            {...props}
            sx={(theme) => ({
                margin: '1rem',
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                boxShadow: theme.palette.primary.buttonShadow,
                [PRESSED]: {
                    backgroundColor: theme.custom.button.pressedBg,
                    color: theme.custom.button.pressedText,
                    boxShadow: theme.custom.button.pressedShadow,
                },
            })}
            {...props}
        />
    )
}

export function SecondaryButton(props) {
    return (
        <ButtonBase
            {...props}
            sx={(theme) => {
                const { button } = theme.custom
                return {
                    boxShadow: theme.palette.secondary.buttonShadow,
                    [DISABLED]: {
                        color: button.buttonPressedBg
                    }
                }
            }}
        />
    )
}

export function GhostButton(props) {
    return (
        <ButtonBase
            {...props}
            sx={(theme) => {
                const { button, hoverInvert } = theme.custom
                    return {
                        margin: '1rem',
                        border: '1px solid transparent', // overrides the browser border, keeps the size
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        textDecoration: 'underline',
                        textDecorationThickness: '2px',
                        textUnderlineOffset: '4px',
                        [HOVER]: {
                            filter: 'none',
                            textDecoration: 'none',
                            backgroundColor: hoverInvert.bg,
                            color: hoverInvert.text,
                        },
                        [PRESSED]: {
                            textDecoration: 'none',
                            backgroundColor: hoverInvert.bg,
                            color: hoverInvert.text,
                            boxShadow: 'none',
                        },
                        [DISABLED]: {
                            borderColor: 'transparent',
                            backgroundColor: 'transparent',
                            color: button.ghostDisabled,
                            textDecoration: 'underline',
                            textDecorationThickness: '2px',
                        },
                    }
            }}
        />
    )
}

export function ThemeButton() {
    const { colorMode, toggleMode } = useAppTheme()
    const isDark = colorMode === 'dark'

    return (
        <ButtonBase
            onClick={toggleMode}
            pressed={isDark}
            icon={isDark ? <SunIcon /> : <MoonIcon />}
        >
            {isDark ? 'Light mode' : 'Dark mode'}
        </ButtonBase>
    )
}