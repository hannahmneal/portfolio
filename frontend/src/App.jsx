// import { useEffect, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001"

export default function App() {
  const [count, setCount] = useState(0)
  // const [status, setStatus] = useState(null)

  // useEffect(() => {
  //   fetch(`${API_URL}/health`)
  //     .then(r => r.json())
  //     .then(d => setStatus(d.status))
  //     .catch(() => setStatus("unreachable"))
  // }, [])

  return (
    <>
      <section id="center">
        <div className="hero" />
        <div>
          <h1>Coming soon!</h1>
          <p>
            This is the home for my professional portfolio.
          </p>
        </div>
      </section>

      {/* <section id="next-steps">
        <div id="docs" />
        <div id="social" />
       </section>
      <section id="spacer"></section> */}
    </>
  )
}
