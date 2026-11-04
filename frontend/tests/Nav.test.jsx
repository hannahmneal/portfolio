import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import Nav from '../src/components/Nav'
import { AppThemeProvider } from '../src/theme'

function renderNavAtPath(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppThemeProvider>
        <Nav />
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

test('renders a link to each page plus the logo link home', () => {
  renderNavAtPath('/')
  expect(screen.getByRole('link', { name: /h\.neal/i })).toHaveAttribute('href', '/')
  expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
  expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')
  expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '/work')
  expect(screen.getByRole('link', { name: 'Now' })).toHaveAttribute('href', '/now')
})

test.each([
  ['/', 'Home'],
  ['/about', 'About'],
  ['/work', 'Work'],
  ['/now', 'Now'],
])('marks the %s tab as the current page', (path, activeLabel) => {
  renderNavAtPath(path)
  expect(screen.getByRole('link', { name: activeLabel })).toHaveAttribute('aria-current', 'page')

  const otherLabels = ['Home', 'About', 'Work', 'Now'].filter((label) => label !== activeLabel)
  otherLabels.forEach((label) => {
    expect(screen.getByRole('link', { name: label })).not.toHaveAttribute('aria-current')
  })
})
