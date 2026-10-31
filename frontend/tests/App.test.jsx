import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import App from '../src/App'

function renderAtPath(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

test.each([
  ['/', 'Home'],
  ['/about', 'About'],
  ['/work', 'Work'],
  ['/now', 'Now'],
  ['/guestbook', 'Guestbook'],
])('renders the %s route heading', (path, heading) => {
  renderAtPath(path)
  expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument()
})

test('renders a not-found heading for an unknown route', () => {
  renderAtPath('/not-found')
  expect(screen.getByRole('heading', { name: /not found/i })).toBeInTheDocument()
})
