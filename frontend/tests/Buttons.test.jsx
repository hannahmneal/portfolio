import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'

import { createAppTheme } from '../src/theme/createAppTheme'
import { AppThemeProvider } from '../src/theme'
import { PrimaryButton, SecondaryButton, GhostButton, ThemeButton } from '../src/components/Buttons'
import { expectStyles, resolveProperty } from './helpers/cssRules'

/**
 * Every button style, per variant, per colour mode, per state.
**/

// --- Expected values -------------------------------------------------------

const ACCENT = '#C8102E'
const ACCENT_TEXT = '#FFFFFF'

const PRIMARY_SHADOW =
  'inset 1px 1px 0 rgba(255,255,255,0.4), inset -1px -2px 0 rgba(0,0,0,0.3), 0 0 0 3px #EEEEEB, 0 0 0 5px #1A1A1A'
const SECONDARY_SHADOW =
  'inset 1px 1px 0px rgba(255,255,255,0.14), inset -1px -2px 0px rgba(0,0,0,0.55)'

const PRESSED_BG = '#5E5E5A'
const PRESSED_TEXT = '#FFFFFF'
const PRESSED_SHADOW = 'inset 2px 2px 0 #2A2A28'

const DISABLED_BG = '#9A9A96'
const DISABLED_TEXT = '#3E3E3B'
const DISABLED_BORDER = '1px solid transparent'

const LIGHT = {
  text: '#1A1A1A',
  bg: '#EEEEEB',
  border: '#1A1A1A',
  invertBg: '#1A1A1A',
  invertText: '#FFFFFF',
  ghostDisabled: '#90908C',
}

const DARK = {
  text: '#F3EFE6',
  bg: '#2A2F37',
  border: '#07080A',
  invertBg: '#F3EFE6',
  invertText: '#0B0D10',
}

// --- Render helpers -------------------------------------------------------

function renderInMode(mode, ui) {
  render(<ThemeProvider theme={createAppTheme(mode)}>{ui}</ThemeProvider>)
  return screen.getByRole('button')
}

function renderThemeButton(mode) {
  window.localStorage.setItem('hneal-theme', mode)
  render(
    <AppThemeProvider>
      <ThemeButton />
    </AppThemeProvider>,
  )
  return screen.getByRole('button')
}

beforeEach(() => {
  window.localStorage.clear()
})

// --- Shared contract ------------------------------------------------------

const CONFIGURABLE_VARIANTS = [
  ['PrimaryButton', (props) => <PrimaryButton {...props}>Primary</PrimaryButton>],
  ['SecondaryButton', (props) => <SecondaryButton {...props}>Secondary</SecondaryButton>],
  ['GhostButton', (props) => <GhostButton {...props}>Ghost</GhostButton>],
]

const ALL_VARIANTS = [...CONFIGURABLE_VARIANTS, ['ThemeButton', () => <ThemeButton />]]

describe.each(['light', 'dark'])('shared contract in %s mode', (mode) => {
  describe.each(ALL_VARIANTS)('%s', (name, renderVariant) => {
    function renderIt() {
      return name === 'ThemeButton' ? renderThemeButton(mode) : renderInMode(mode, renderVariant({}))
    }

    test('renders a native button', () => {
      const el = renderIt()
      expect(el.tagName).toBe('BUTTON')
      expect(el).toHaveAttribute('type', 'button')
    })

    test('meets the 44px minimum button width', () => {
      expectStyles(renderIt(), 'rest', {
        'min-height': '44px',
        padding: '0px 14px',
        'border-radius': '7px',
        gap: '10px',
        display: 'inline-flex',
        'align-items': 'center',
      })
    })

    test('uses font IBM Plex Sans with font weight 600 at 14px', () => {
      expectStyles(renderIt(), 'rest', {
        'font-family': '"IBM Plex Sans", sans-serif',
        'font-weight': '600',
        'font-size': '14px',
      })
    })

    test('shows a pointer cursor when enabled', () => {
      expectStyles(renderIt(), 'rest', { cursor: 'pointer' })
    })
  })

  describe.each(CONFIGURABLE_VARIANTS)('%s when disabled', (name, renderVariant) => {
    test('is muted, loses its bevel and shows a not-allowed cursor', () => {
      const el = renderInMode(mode, renderVariant({ disabled: true }))
      expectStyles(el, 'rest', {
        'background-color': name === 'GhostButton' ? 'transparent' : DISABLED_BG,
        'box-shadow': 'none',
        cursor: 'not-allowed',
      })
    })

    test('keeps a 1px border so the box does not shift', () => {
      const el = renderInMode(mode, renderVariant({ disabled: true }))
      expectStyles(el, 'rest', {
        border: DISABLED_BORDER,
        'border-color': 'transparent',
      })
    })

    test('does not brighten or depress on hover or press', () => {
      const el = renderInMode(mode, renderVariant({ disabled: true }))
      // The `:not(:disabled)` guards keep every interactive rule from matching.
      expect(resolveProperty(el, 'filter', 'hover')).toBe('')
      expectStyles(el, 'active', {
        'background-color': name === 'GhostButton' ? 'transparent' : DISABLED_BG,
      })
    })

    test('blocks clicks', () => {
      const onClick = vi.fn()
      const el = renderInMode(mode, renderVariant({ disabled: true, onClick }))
      fireEvent.click(el)
      expect(onClick).not.toHaveBeenCalled()
      expect(el).toBeDisabled()
    })
  })
})

// --- PrimaryButton --------------------------------------------------------

describe('PrimaryButton', () => {
  describe('light mode', () => {
    test('rests on the accent color with white text, a dark border and the ringed bevel', () => {
      expectStyles(renderInMode('light', <PrimaryButton>Primary</PrimaryButton>), 'rest', {
        'background-color': ACCENT,
        color: ACCENT_TEXT,
        border: `1px solid ${LIGHT.border}`,
        'box-shadow': PRIMARY_SHADOW,
        margin: '1rem',
      })
    })

    test('brightens on hover without changing its accent color', () => {
      expectStyles(renderInMode('light', <PrimaryButton>Primary</PrimaryButton>), 'hover', {
        filter: 'brightness(1.12)',
        'background-color': ACCENT,
        'box-shadow': PRIMARY_SHADOW,
      })
    })

    test('goes grey and loses its ring while pressed', () => {
      expectStyles(renderInMode('light', <PrimaryButton>Primary</PrimaryButton>), 'active', {
        'background-color': PRESSED_BG,
        color: PRESSED_TEXT,
        'box-shadow': PRESSED_SHADOW,
      })
    })

    test('shows the same pressed styles while `aria-pressed` is true', () => {
      expectStyles(renderInMode('light', <PrimaryButton pressed>Primary</PrimaryButton>), 'rest', {
        'background-color': PRESSED_BG,
        color: PRESSED_TEXT,
        'box-shadow': PRESSED_SHADOW,
      })
    })

    test('is fully muted when disabled', () => {
      expectStyles(renderInMode('light', <PrimaryButton disabled>Primary</PrimaryButton>), 'rest', {
        'background-color': DISABLED_BG,
        color: DISABLED_TEXT,
        border: DISABLED_BORDER,
        'box-shadow': 'none',
        cursor: 'not-allowed',
      })
    })
  })

  describe('dark mode', () => {
    test('keeps the accent color but takes the dark border', () => {
      expectStyles(renderInMode('dark', <PrimaryButton>Primary</PrimaryButton>), 'rest', {
        'background-color': ACCENT,
        color: ACCENT_TEXT,
        border: `1px solid ${DARK.border}`,
      })
    })

    test('is muted when disabled, using the shared light disabled colors', () => {
      expectStyles(renderInMode('dark', <PrimaryButton disabled>Primary</PrimaryButton>), 'rest', {
        'background-color': DISABLED_BG,
        color: DISABLED_TEXT,
        'box-shadow': 'none',
      })
    })
  })
})

// --- SecondaryButton ------------------------------------------------------

describe('SecondaryButton', () => {
  describe('light mode', () => {
    test('rests on the light button bg with dark text and a bevel', () => {
      expectStyles(renderInMode('light', <SecondaryButton>Secondary</SecondaryButton>), 'rest', {
        'background-color': LIGHT.bg,
        color: LIGHT.text,
        border: `1px solid ${LIGHT.border}`,
        'box-shadow': SECONDARY_SHADOW,
        margin: '1rem',
      })
    })

    test('brightens on hover', () => {
      expectStyles(renderInMode('light', <SecondaryButton>Secondary</SecondaryButton>), 'hover', {
        filter: 'brightness(1.12)',
      })
    })

    test('inverts to grey while pressed', () => {
      expectStyles(renderInMode('light', <SecondaryButton>Secondary</SecondaryButton>), 'active', {
        'background-color': PRESSED_BG,
        color: PRESSED_TEXT,
        'box-shadow': PRESSED_SHADOW,
      })
    })

    test('shows the pressed styles while `aria-pressed` is true', () => {
      expectStyles(renderInMode('light', <SecondaryButton pressed>Secondary</SecondaryButton>), 'rest', {
        'background-color': PRESSED_BG,
        'box-shadow': PRESSED_SHADOW,
      })
    })

    // GAP 5: the variant's own disabled override reads a key that does not exist,
    // so the colour comes from the base `[DISABLED]` block instead.
    test('GAP 5: falls back to the shared disabled text colour', () => {
      expectStyles(renderInMode('light', <SecondaryButton disabled>Secondary</SecondaryButton>), 'rest', {
        color: DISABLED_TEXT,
        'background-color': DISABLED_BG,
      })
    })
  })

  describe('dark mode', () => {
    test('rests on the dark button bg with light text and the dark border', () => {
      expectStyles(renderInMode('dark', <SecondaryButton>Secondary</SecondaryButton>), 'rest', {
        'background-color': DARK.bg,
        color: DARK.text,
        border: `1px solid ${DARK.border}`,
      })
    })
  })
})

// --- GhostButton ----------------------------------------------------------

describe('GhostButton', () => {
  describe('light mode', () => {
    test('is transparent and bevel-free, sized like its siblings', () => {
      expectStyles(renderInMode('light', <GhostButton>Ghost</GhostButton>), 'rest', {
        'background-color': 'transparent',
        color: LIGHT.text,
        // A transparent border rather than none, so it does not shift.
        border: '1px solid transparent',
        'box-shadow': 'none',
        margin: '1rem',
      })
    })

    test('underlines its label at 2px, offset clear of the descenders', () => {
      expectStyles(renderInMode('light', <GhostButton>Ghost</GhostButton>), 'rest', {
        'text-decoration': 'underline',
        'text-decoration-thickness': '2px',
        'text-underline-offset': '4px',
      })
    })

    test('inverts on hover, dropping the underline and the shared brightness filter', () => {
      expectStyles(renderInMode('light', <GhostButton>Ghost</GhostButton>), 'hover', {
        'background-color': LIGHT.invertBg,
        color: LIGHT.invertText,
        'text-decoration': 'none',
        filter: 'none',
      })
    })

    test('inverts while pressed and lacks bevel', () => {
      expectStyles(renderInMode('light', <GhostButton>Ghost</GhostButton>), 'active', {
        'background-color': LIGHT.invertBg,
        color: LIGHT.invertText,
        'text-decoration': 'none',
        'box-shadow': 'none',
      })
    })

    test('keeps its underline when disabled, in its own muted grey', () => {
      expectStyles(renderInMode('light', <GhostButton disabled>Ghost</GhostButton>), 'rest', {
        'background-color': 'transparent',
        'border-color': 'transparent',
        color: LIGHT.ghostDisabled,
        'text-decoration': 'underline',
        'text-decoration-thickness': '2px',
      })
    })
  })

  describe('dark mode', () => {
    test('is transparent with light text', () => {
      expectStyles(renderInMode('dark', <GhostButton>Ghost</GhostButton>), 'rest', {
        'background-color': 'transparent',
        color: DARK.text,
        'box-shadow': 'none',
        'text-decoration': 'underline',
      })
    })

    test('inverts to light-on-dark on hover', () => {
      expectStyles(renderInMode('dark', <GhostButton>Ghost</GhostButton>), 'hover', {
        'background-color': DARK.invertBg,
        color: DARK.invertText,
        'text-decoration': 'none',
        filter: 'none',
      })
    })

    // Ghost is the only variant whose pressed state works in dark mode, because
    // it uses `hoverInvert` rather than the missing `buttonPressed*` tokens.
    test('inverts while held down', () => {
      expectStyles(renderInMode('dark', <GhostButton>Ghost</GhostButton>), 'active', {
        'background-color': DARK.invertBg,
        color: DARK.invertText,
        'box-shadow': 'none',
      })
    })
  })
})

// --- ThemeButton ----------------------------------------------------------

describe('ThemeButton', () => {
  test('offers dark mode and reports itself unpressed when light', () => {
    const el = renderThemeButton('light')
    expect(el).toHaveTextContent('Dark mode')
    expect(el).toHaveAttribute('aria-pressed', 'false')
  })

  test('offers light mode and reports itself pressed when dark', () => {
    const el = renderThemeButton('dark')
    expect(el).toHaveTextContent('Light mode')
    expect(el).toHaveAttribute('aria-pressed', 'true')
  })

  test('renders a decorative icon that is hidden from assistive tech', () => {
    const el = renderThemeButton('light')
    const icon = el.querySelector('svg')
    expect(icon).not.toBeNull()
    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })

  test('swaps the label, the icon and `aria-pressed` when clicked', () => {
    const el = renderThemeButton('light')
    const moon = el.querySelector('svg').outerHTML

    fireEvent.click(el)

    expect(el).toHaveTextContent('Light mode')
    expect(el).toHaveAttribute('aria-pressed', 'true')
    expect(el.querySelector('svg').outerHTML).not.toBe(moon)
  })

  // 👇🏻 Why localStorage is cleared before each test
  test('persists the chosen mode', () => {
    fireEvent.click(renderThemeButton('light'))
    expect(window.localStorage.getItem('hneal-theme')).toBe('dark')
  })

  test('takes the secondary button colours in light mode', () => {
    expectStyles(renderThemeButton('light'), 'rest', {
      'background-color': LIGHT.bg,
      color: LIGHT.text,
      border: `1px solid ${LIGHT.border}`,
    })
  })

  // Its own `sx` supplies the bevel, because the base button has none to
  // inherit: `theme.custom.button.shadow` does not exist in either mode.
  // Both modes share one bevel, so this value does not change with the mode.
  test.each(['light', 'dark'])('takes the secondary bevel in %s mode', (mode) => {
    expectStyles(renderThemeButton(mode), 'rest', {
      'box-shadow': SECONDARY_SHADOW,
    })
  })
})

// --- Behaviour shared by the configurable variants ------------------------

describe.each(CONFIGURABLE_VARIANTS)('%s behaviour', (name, renderVariant) => {
  test('calls onClick when clicked', () => {
    const onClick = vi.fn()
    fireEvent.click(renderInMode('light', renderVariant({ onClick })))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test('omits `aria-pressed` entirely unless `pressed` is given', () => {
    // `aria-pressed="false"` would have screen readers announce a toggle button.
    expect(renderInMode('light', renderVariant({}))).not.toHaveAttribute('aria-pressed')
  })

  test.each([
    [true, 'true'],
    [false, 'false'],
  ])('maps pressed=%s to aria-pressed="%s"', (pressed, attribute) => {
    expect(renderInMode('light', renderVariant({ pressed }))).toHaveAttribute('aria-pressed', attribute)
  })

  test('renders an icon before its label', () => {
    const el = renderInMode('light', renderVariant({ icon: <span data-testid="icon">*</span> }))
    expect(el.firstChild).toBe(screen.getByTestId('icon'))
  })

  test('forwards arbitrary DOM props without leaking icon or pressed', () => {
    const el = renderInMode('light', renderVariant({ 'aria-label': 'Labelled', id: 'btn-1', icon: null }))
    expect(el).toHaveAttribute('id', 'btn-1')
    expect(el).toHaveAccessibleName('Labelled')
    expect(el).not.toHaveAttribute('icon')
    expect(el).not.toHaveAttribute('pressed')
  })
})

// --- Theme token contract -------------------------------------------------

describe('button theme colors', () => {
  test('light mode exposes every color the button styles read', () => {
    expect(createAppTheme('light').custom.button).toEqual({
      bg: '#EEEEEB',
      border: '#1A1A1A',
      text: '#1A1A1A',
      minHeight: 44,
      pressedBg: PRESSED_BG,
      pressedText: PRESSED_TEXT,
      pressedShadow: PRESSED_SHADOW,
      disabledBg: DISABLED_BG,
      disabledText: DISABLED_TEXT,
      disabledBorder: DISABLED_BORDER,
      ghostDisabled: '#90908c',
    })
  })

  // If a bevel is ever added to the Base Button, this fails
  // and the variants' own `boxShadow` overrides should be revisited.
  test.each(['light', 'dark'])('every %s-mode variant supplies its own bevel', (mode) => {
    for (const [, renderVariant] of CONFIGURABLE_VARIANTS) {
      const { unmount } = render(
        <ThemeProvider theme={createAppTheme(mode)}>{renderVariant({})}</ThemeProvider>,
      )
      expect(resolveProperty(screen.getByRole('button'), 'box-shadow')).not.toBe('')
      unmount()
    }
  })

  test.each(['light', 'dark'])('%s mode carries both bevels on the palette', (mode) => {
    const { palette } = createAppTheme(mode)
    expect(palette.primary.buttonShadow).toBe(PRIMARY_SHADOW)
    expect(palette.secondary.buttonShadow).toBe(SECONDARY_SHADOW)
  })

  test('the accent is the Swiss red default with white text', () => {
    const { palette } = createAppTheme('light')
    expect(palette.primary.main).toBe(ACCENT)
    expect(palette.primary.contrastText).toBe(ACCENT_TEXT)
  })

  test('a chosen accent reaches the primary button', () => {
    expectStyles(
      renderInMode('light', <PrimaryButton>P</PrimaryButton>),
      'rest',
      { 'background-color': ACCENT },
    )
    render(
      <ThemeProvider theme={createAppTheme('light', '#2B4FD8')}>
        <PrimaryButton>Blue</PrimaryButton>
      </ThemeProvider>,
    )
    expectStyles(screen.getByRole('button', { name: 'Blue' }), 'rest', {
      'background-color': '#2B4FD8',
    })
  })
})
