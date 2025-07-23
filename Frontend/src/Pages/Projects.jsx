import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from './UserContext.jsx'
import logo from '../assets/logo1.png'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const { userId, token } = useContext(UserContext)

  useEffect(() => {
    if (!userId) return

    fetch(`http://localhost:8000/api/projects?user_id=${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => (res.ok ? res.json() : []))
      .then(data => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setProjects([]))
  }, [userId, token])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#625DF5] to-transparent">
      {/* navbar full‑width */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4 text-white">
            <img src={logo} alt="Logo" className="w-12 h-12 rounded-full bg-white p-1" />
            <span className="text-2xl font-bold">Next_Page</span>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search in projects"
              className="w-64 rounded-lg border border-slate-200 px-4 py-2 text-sm"
            />
            <button className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600">
              New Project
            </button>
            <div
              className="w-10 h-10 rounded-full bg-cover bg-center border"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCB6kVfzkQcBJF-8Zr1op7XJrlSN3T2Agi9wDUjMD68R0N8sGPe8esmtrBe0JADQKJJNPDaHqftmNjQc8WBlB0yIBrHYinma-jSOvQDGlZBAastI2-ktuyE8nMxLq5J0CTRHeom7baiN7PQ7AYWJUFmlpj66JHXQDEE066jct78l4twgYMkhwRWT6GpqeEOC6q9iCo35PZQjyoz9L468FVYYBWX4zFUL-hLHYCiWpt4P_DwAMPsipIFakokvPswucCpsbF-6Efpk7xl")' ,
              }}
            />
          </div>
        </div>
      </header>

      {/* espaço para não sobrepor o main */}
      <main className="pt-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* título abaixo da navbar */}
          <h1 className="text-white text-3xl font-bold mb-6">Your Projects</h1>

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
                {projects.length > 0 ? (
                  projects.map(proj => (
                    <tr key={proj.id}>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">
                        {proj.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {proj.last_modified}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            proj.main_branch === 'main'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {proj.main_branch}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex gap-2">
                          <button className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                            Edit
                          </button>
                          <button className="rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-500">
                      Não foram encontrados projetos anteriores.
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
