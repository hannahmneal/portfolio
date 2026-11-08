import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import Footer from '../src/components/Footer'
import { AppThemeProvider } from '../src/theme'

function renderFooterAtPath(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppThemeProvider>
        <Footer />
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

test('renders a footer landmark holding a labelled footer nav', () => {
  renderFooterAtPath('/')
  expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  expect(screen.getByRole('navigation', { name: 'Footer' })).toBeInTheDocument()
})

test('links to every page, including the guestbook', () => {
  renderFooterAtPath('/')
  expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
  expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')
  expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '/work')
  expect(screen.getByRole('link', { name: 'Now' })).toHaveAttribute('href', '/now')
  expect(screen.getByRole('link', { name: 'Guestbook' })).toHaveAttribute('href', '/guestbook')
})

test('offers a back to top link pointing at the page anchor', () => {
  renderFooterAtPath('/work')
  expect(screen.getByRole('link', { name: /back to top/i })).toHaveAttribute('href', '#top')
})

test.each([
  ['/', 'Home'],
  ['/about', 'About'],
  ['/work', 'Work'],
  ['/now', 'Now'],
  ['/guestbook', 'Guestbook'],
])('marks the %s link as the current page', (path, activeLabel) => {
  renderFooterAtPath(path)
  expect(screen.getByRole('link', { name: activeLabel })).toHaveAttribute('aria-current', 'page')

  const others = ['Home', 'About', 'Work', 'Now', 'Guestbook'].filter((l) => l !== activeLabel)
  others.forEach((label) => {
    expect(screen.getByRole('link', { name: label })).not.toHaveAttribute('aria-current')
  })
})

test('shows the status bar panes', () => {
  renderFooterAtPath('/')
  expect(screen.getByText('Status: online')).toBeInTheDocument()
  expect(screen.getByText(/Last updated: 2026/)).toBeInTheDocument()
  expect(screen.getByText('Visitors')).toBeInTheDocument()
  expect(screen.getByText('Loading')).toBeInTheDocument()
  expect(screen.getByText('Made with nothing but CSS')).toBeInTheDocument()
})

test('announces the visitor count once rather than per digit tile', () => {
  renderFooterAtPath('/')
  const counter = screen.getByLabelText('001337')
  expect(counter).toBeInTheDocument()
  // The six tiles themselves are decorative.
  expect(counter.querySelectorAll('[aria-hidden="true"]')).toHaveLength(6)
})

test('shows the copyright line', () => {
  renderFooterAtPath('/')
  expect(screen.getByText('© 2026')).toBeInTheDocument()
})
