import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import About from './pages/About'
import Work from './pages/Work'
import Now from './pages/Now'
import Guestbook from './pages/Guestbook'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/work" element={<Work />} />
      <Route path="/now" element={<Now />} />
      <Route path="/guestbook" element={<Guestbook />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
