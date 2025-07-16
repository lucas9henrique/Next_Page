import { useState, useRef } from 'react'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const errorRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email !== 'user@example.com' || password !== 'password123') {
      setError(true)
      const node = errorRef.current
      if (node) {
        node.style.animation = 'none'
        node.offsetHeight
        node.style.animation = ''
      }
    } else {
      setError(false)
      alert('Login successful (demo)!')
    }
  }

  return (
    <div className="bg-[#69BDF5]" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#69BDF5] to-[#82F0FA] p-6">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl rounded-xl bg-white p-8 lg:p-12 shadow-2xl">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex items-center gap-3 text-[#625DF5]">
              <svg className="h-10 w-10 text-[#625DF5]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor"></path>
              </svg>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Next_Page</h1>
            </div>
            <p className="text-[#0045F5] text-base sm:text-lg">Welcome back! Please sign in to your account.</p>
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
                  className="form-input block w-full rounded-lg border-[#89A9FA] py-3 px-4 shadow-sm placeholder:text-slate-400 focus:border-[#0045F5] focus:ring-[#0045F5] sm:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700" htmlFor="password">Password</label>
                <div className="text-sm">
                  <a className="font-medium text-[#A473FA] hover:text-[#625DF5]" href="#">Forgot your password?</a>
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
                  className="form-input block w-full rounded-lg border-[#89A9FA] py-3 px-4 shadow-sm placeholder:text-slate-400 focus:border-[#0045F5] focus:ring-[#0045F5] sm:text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            {error && (
              <div ref={errorRef} id="errorMessage" className="rounded-md bg-red-50 p-4 error-message">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg aria-hidden="true" className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-10a1 1 0 10-2 0v4a1 1 0 102 0V8zm-1 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-[#A473FA]">Invalid email or password. Please try again.</p>
                  </div>
                </div>
              </div>
            )}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-lg bg-[#0045F5] py-3 px-4 lg:py-4 lg:px-6 text-sm lg:text-base font-semibold text-white shadow-sm hover:bg-[#625DF5] focus:outline-none focus:ring-2 focus:ring-[#0045F5] focus:ring-offset-2 transition-colors duration-150"
              >
                Sign in
              </button>
            </div>
          </form>
          <p className="mt-8 text-center text-sm text-slate-600">
            New to CodeCollab?
            <a className="font-medium text-[#A473FA] hover:text-[#625DF5]" href="#"> Create an account</a>
          </p>
        </div>
        <footer className="mt-10 text-center text-sm text-[#625DF5]">
          <p>© 2025 Next_Page. All rights reserved.</p>
          <div className="mt-2">
            <a className="hover:text-[#0045F5]" href="#">Privacy Policy</a>
            <span className="mx-2">|</span>
            <a className="hover:text-[#0045F5]" href="#">Terms of Service</a>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Login
