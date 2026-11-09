import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import Banner from '../src/components/Banner'
import App from '../src/App'
import { AppThemeProvider } from '../src/theme'
import { createAppTheme } from '../src/theme/createAppTheme'

function renderBanner() {
  return render(
    <AppThemeProvider>
      <Banner />
    </AppThemeProvider>,
  )
}

test('renders the scrolling marquee strip', () => {
  const { container } = renderBanner()
  const marquee = screen.getByTestId('banner-marquee')
  expect(marquee).toBeInTheDocument()
  expect(container.textContent).toContain('WELCOME')
})

test('repeats the message twice so the loop is seamless', () => {
  renderBanner()
  const strips = screen.getByTestId('banner-marquee').children
  expect(strips).toHaveLength(2)
  // Both copies carry identical text, which is what makes the -50% slide loop.
  expect(strips[0].textContent).toBe(strips[1].textContent)
  expect(strips[0].textContent).not.toBe('')
})

test('hides the decorative marquee from assistive tech', () => {
  const { container } = renderBanner()
  expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
})

test.each([
  ['light', '#1A1A1A', '#D9D9D4'],
  ['dark', '#0B0D10', '#8E959D'],
])('exposes the %s mode banner tokens', (mode, bg, text) => {
  const { banner } = createAppTheme(mode).custom
  expect(banner.bg).toBe(bg)
  expect(banner.text).toBe(text)
})

test('only dark mode draws a hairline under the banner', () => {
  expect(createAppTheme('light').custom.banner.borderBottom).toBe('none')
  expect(createAppTheme('dark').custom.banner.borderBottom).toBe('1px solid #22262C')
})

test('sits above the nav on every page', () => {
  const { container } = render(
    <MemoryRouter initialEntries={['/about']}>
      <AppThemeProvider>
        <App />
      </AppThemeProvider>
    </MemoryRouter>,
  )

  const marquee = screen.getByTestId('banner-marquee')
  const nav = screen.getByRole('navigation', { name: 'Main' })
  expect(marquee).toBeInTheDocument()
  // Node.DOCUMENT_POSITION_FOLLOWING: the nav comes after the banner.
  expect(marquee.compareDocumentPosition(nav) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  expect(container).toBeInTheDocument()
})
