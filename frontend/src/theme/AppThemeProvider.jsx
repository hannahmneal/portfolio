import { useMemo, useState, useCallback } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { createAppTheme } from './createAppTheme'
import { defaultAccent } from './styles'
import { AppThemeContext } from './AppThemeContext'

const THEME_STORAGE_KEY = 'hneal-theme'
const ACCENT_STORAGE_KEY = 'hneal-accent'

function readStoredColorMode() {
  if (typeof window === 'undefined') return 'light'
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    // localStorage can throw (e.g. Safari private browsing); fall back below.
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function readStoredAccentColor() {
  if (typeof window === 'undefined') return defaultAccent
  try {
    return window.localStorage.getItem(ACCENT_STORAGE_KEY) ?? defaultAccent
  } catch {
    return defaultAccent
  }
}

export function AppThemeProvider({ children }) {
  const [colorMode, setColorModeState] = useState(readStoredColorMode)
  const [accentColor, setAccentColorState] = useState(readStoredAccentColor)

  const setColorMode = useCallback((next) => {
    setColorModeState(next)
    try {
      window.localStorage?.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // ignore write failures (e.g. Safari private browsing)
    }
  }, [])

  const toggleMode = useCallback(() => {
    setColorMode(colorMode === 'dark' ? 'light' : 'dark')
  }, [colorMode, setColorMode])

  const setAccentColor = useCallback((next) => {
    setAccentColorState(next)
    try {
      window.localStorage?.setItem(ACCENT_STORAGE_KEY, next)
    } catch {
      // ignore write failures (e.g. Safari private browsing)
    }
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
