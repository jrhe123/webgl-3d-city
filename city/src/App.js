import { useEffect } from 'react'
// utils
import { initCity } from './utils'

function App() {
  useEffect(() => {
    initCity()
  }, [])

  return (
    <div>
      <canvas id="webgl"></canvas>
    </div>
  )
}

export default App
