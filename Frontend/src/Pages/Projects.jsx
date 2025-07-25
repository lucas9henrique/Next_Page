import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from './UserContext.jsx'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo1.png'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [shareCode, setShareCode] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const { userId, token } = useContext(UserContext)
  const navigate = useNavigate()
  const menuRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    if (!userId) return
    setIsLoading(true)

    fetch(`http://localhost:8000/api/projects?user_id=${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setProjects([]))
      .finally(() => setIsLoading(false))
  }, [userId, token])

  useEffect(() => {
    if (!menuOpen) return

    function handleOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [menuOpen])

  const handleCreate = () => {
    fetch('http://localhost:8000/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Untitled' }),
    })
      .then(res => (res.ok ? res.json() : Promise.reject(res)))
      .then(data => {
        setMenuOpen(false)
        navigate(`/editor/${data.id}`)
      })
      .catch(() => {
        setMenuOpen(false)
        alert('Erro ao criar projeto.')
      })
  }

  const handleJoin = e => {
    e.preventDefault()
    if (shareCode.trim()) {
      setMenuOpen(false)
      navigate(`/editor/${shareCode.trim()}`)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este projeto?')) return

    try {
      const res = await fetch(`http://localhost:8000/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== id))
      } else {
        alert('Erro ao excluir projeto.')
      }
    } catch (error) {
      alert('Erro ao excluir projeto.')
    }
  }

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#625DF5] to-transparent">
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#625DF5] to-transparent border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4 text-white">
            <img
              src={logo}
              alt="Logo"
              className="w-12 h-12 rounded-full bg-white p-1"
            />
            <span className="text-2xl font-bold">Next_Page</span>
          </div>
          <div className="flex items-center gap-4 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search in projects"
              className="w-64 rounded-lg border border-slate-200 px-4 py-2 text-sm"
            />
            <button
              ref={buttonRef}
              onClick={() => setMenuOpen(prev => !prev)}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
            >
              New Project
            </button>
            {menuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 top-12 z-80 w-64 rounded-md bg-white p-4 shadow-lg space-y-3">
                <button
                  onClick={handleCreate}
                  className="w-full rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                >
                  Create New Document
                </button>
                <form onSubmit={handleJoin} className="flex gap-2">
                  <input
                    type="text"
                    value={shareCode}
                    onChange={e => setShareCode(e.target.value)}
                    placeholder="Share code"
                    className="flex-1 rounded-md border border-slate-300 px-2 py-1 text-black text-sm"
                  />
                  <button
                    type="submit"
                    className="rounded-md bg-blue-500 px-3 py-1 text-sm font-semibold text-white hover:bg-blue-600"
                  >
                    Enter
                  </button>
                </form>
              </div>
            )}
            <div
              className="w-10 h-10 rounded-full bg-cover bg-center border"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCB6kVfzkQcBJF-8Zr1op7XJrlSN3T2Agi9wDUjMD68R0N8sGPe8esmtrBe0JADQKJJNPDaHqftmNjQc8WBlB0yIBrHYinma-jSOvQDGlZBAastI2-ktuyE8nMxLq5J0CTRHeom7baiN7PQ7AYWJUFmlpj66JHXQDEE066jct78l4twgYMkhwRWT6GpqeEOC6q9iCo35PZQjyoz9L468FVYYBWX4zFUL-hLHYCiWpt4P_DwAMPsipIFakokvPswucCpsbF-6Efpk7xl")',
              }}
            />
          </div>
        </div>
      </header>

      <main className="pt-[72px] px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-white text-3xl font-bold mt-10 mb-6">Your Projects</h1>

          <div className="overflow-hidden rounded-lg bg-white shadow-sm">
            <table className="w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">
                    Project Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">
                    Last Modified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">
                    Main Branch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-500">
                      Carregando projetos...
                    </td>
                  </tr>
                ) : filteredProjects.length > 0 ? (
                  filteredProjects.map(proj => (
                    <tr key={proj.id}>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {proj.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(proj.last_modified).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${proj.main_branch === 'main'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                            }`}
                        >
                          {proj.main_branch}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/editor/${proj.id}`)}
                            className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(proj.id)}
                            className="rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-4 text-center text-sm text-slate-500"
                    >
                      Nenhum projeto encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
