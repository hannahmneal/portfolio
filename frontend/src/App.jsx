import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

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

export default App
