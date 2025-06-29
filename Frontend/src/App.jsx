import { useState } from 'react'
import Login from './Pages/Login.jsx'
import Register from './Pages/Register.jsx'

function App() {
  const [page, setPage] = useState('login')
  return page === 'login' ? (
    <Login onShowRegister={() => setPage('register')} />
  ) : (
    <Register onShowLogin={() => setPage('login')} />
  )
}

export default App
