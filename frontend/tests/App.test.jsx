import { render, screen } from '@testing-library/react'
import App from '../src/App'

test('renders the "coming soon" heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /coming soon/i })).toBeInTheDocument()
})

test('renders the portfolio description', () => {
    render(<App />)
    expect(screen.getByText(/professional portfolio/i)).toBeInTheDocument()
})