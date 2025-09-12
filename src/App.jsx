import { useState } from 'react'
import './App.css'
import AppRoutes from './Routes/route';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <AppRoutes/>
      </div>
      
    </>
  )
}

export default App
