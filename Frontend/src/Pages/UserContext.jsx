import { createContext, useState, useEffect } from 'react'

export const UserContext = createContext({ userId: null, token: null })

function parseJwt (token) {
  try {
    const base64 = token.split('.')[1]
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

export function UserProvider ({ children }) {
  const [userId, setUserId] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('token')
    if (stored) {
      setToken(stored)
      const payload = parseJwt(stored)
      if (payload?.sub) setUserId(payload.sub)
    }
  }, [])

  const login = async (email, password) => {
    const resp = await fetch('https://next-page-backend.onrender.com/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!resp.ok) {
      const data = await resp.json().catch(() => ({}))
      throw new Error(data.detail || 'Login failed')
    }
    const data = await resp.json()
    setToken(data.token)
    localStorage.setItem('token', data.token)
    const payload = parseJwt(data.token)
    if (payload?.sub) setUserId(payload.sub)
  }

  const logout = () => {
    setUserId(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  return (
    <UserContext.Provider value={{ userId, token, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContext
