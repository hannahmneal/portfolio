import { Box } from '@mui/material'
import { Routes, Route } from 'react-router'
import Banner from './components/Banner'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Work from './pages/Work'
import Now from './pages/Now'
import Guestbook from './pages/Guestbook'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    // id="top" is the target for the footer's "Back to top" link.
    <Box
      id="top"
      sx={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', width: '100%' }}
    >
      <Banner />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/work" element={<Work />} />
        <Route path="/now" element={<Now />} />
        <Route path="/guestbook" element={<Guestbook />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Box>
  )
}
