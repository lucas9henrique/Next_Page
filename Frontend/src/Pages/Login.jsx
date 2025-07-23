import { useState, useRef } from 'react'
import './Login.css'
import logo from '../assets/logo1.png'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const errorRef = useRef(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const resp = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!resp.ok) {
        const data = await resp.json()
        setError(data.detail || 'Login failed')
        const node = errorRef.current
        if (node) {
          node.style.animation = 'none'
          node.offsetHeight
          node.style.animation = ''
        }
      } else {
        setError('')
        navigate('/projects')
      }
    } catch (err) {
      setError('Network error')
    }
  }

  return (
    <div className="bg-slate-100" style={{ fontFamily: 'Manrope, \"Noto Sans\", sans-serif' }}>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#625DF5] to-transparent p-6">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex items-center gap-3 text-slate-800">
              <img src={logo} alt="Logo" className="w-20 h-20" />
              <h1 className="text-3xl font-bold tracking-tight">Next_Page</h1>
            </div>
            <p className="text-slate-600">Welcome back! Please sign in to your account.</p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="email">Email address</label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="form-input text-black block w-full rounded-lg border-slate-300 py-3 px-4 shadow-sm placeholder:text-slate-400 focus:border-[#0c7ff2] focus:ring-[#0c7ff2] sm:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700" htmlFor="password">Password</label>
                <div className="text-sm">
                  <a className="font-medium text-[#0c7ff2] hover:text-[#0a68c4]" href="#">Forgot your password?</a>
                </div>
              </div>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="form-input text-black block w-full rounded-lg border-slate-300 py-3 px-4 shadow-sm placeholder:text-slate-400 focus:border-[#0c7ff2] focus:ring-[#0c7ff2] sm:text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            {error && (
              <div ref={errorRef} id="errorMessage" className="rounded-md bg-red-50 p-4 error-message">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg aria-hidden="true" className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-10a1 1 0 10-2 0v4a1 1 0 102 0V8zm-1 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}
            <div>
              <button type="submit" className="flex w-full justify-center rounded-lg bg-[#0c7ff2] py-3 px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#0a68c4] focus:outline-none focus:ring-2 focus:ring-[#0c7ff2] focus:ring-offset-2 transition-colors duration-150">
                Sign in
              </button>
            </div>
          </form>
          <p className="mt-8 text-center text-sm text-slate-600">
            New to Next_Page?
            <Link className="font-medium text-[#0c7ff2] hover:text-[#0a68c4]" to="/register"> Create an account</Link>
          </p>
        </div>
        <footer className="mt-10 text-black-600 text-center text-sm text-slate-400">
          <p>© 2025 Next_Page. All rights reserved.</p>
          <div className="mt-2">
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Login

