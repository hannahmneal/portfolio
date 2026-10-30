import { useMemo, useState, useCallback } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { createAppTheme } from './createAppTheme'
import { defaultAccent } from './styles'
import { AppThemeContext } from './AppThemeContext'

const THEME_STORAGE_KEY = 'hneal-theme'
const ACCENT_STORAGE_KEY = 'hneal-accent'

function readStoredColorMode() {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function readStoredAccentColor() {
  if (typeof window === 'undefined') return defaultAccent
  return window.localStorage.getItem(ACCENT_STORAGE_KEY) ?? defaultAccent
}

export function AppThemeProvider({ children }) {
  const [colorMode, setColorModeState] = useState(readStoredColorMode)
  const [accentColor, setAccentColorState] = useState(readStoredAccentColor)

  const setColorMode = useCallback((next) => {
    setColorModeState(next)
    window.localStorage?.setItem(THEME_STORAGE_KEY, next)
  }, [])

  const toggleMode = useCallback(() => {
    setColorMode(colorMode === 'dark' ? 'light' : 'dark')
  }, [colorMode, setColorMode])

  const setAccentColor = useCallback((next) => {
    setAccentColorState(next)
    window.localStorage?.setItem(ACCENT_STORAGE_KEY, next)
  }, [])

  const theme = useMemo(() => createAppTheme(colorMode, accentColor), [colorMode, accentColor])

  const value = useMemo(
    () => ({ colorMode, setColorMode, toggleMode, accentColor, setAccentColor }),
    [colorMode, setColorMode, toggleMode, accentColor, setAccentColor],
  )

  return (
    <AppThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppThemeContext.Provider>
  )
}
