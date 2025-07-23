import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from './UserContext.jsx'
import logo from '../assets/logo1.png'

function Projects() {
  const [projects, setProjects] = useState([])
  const { userId, token } = useContext(UserContext)
  const pageStyle = { fontFamily: '"Roboto", "Noto Sans", sans-serif' };
  const avatarStyle = { backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCB6kVfzkQcBJF-8Zr1op7XJrlSN3T2Agi9wDUjMD68R0N8sGPe8esmtrBe0JADQKJJNPDaHqftmNjQc8WBlB0yIBrHYinma-jSOvQDGlZBAastI2-ktuyE8nMxLq5J0CTRHeom7baiN7PQ7AYWJUFmlpj66JHXQDEE066jct78l4twgYMkhwRWT6GpqeEOC6q9iCo35PZQjyoz9L468FVYYBWX4zFUL-hLHYCiWpt4P_DwAMPsipIFakokvPswucCpsbF-6Efpk7xl")' }

  useEffect(() => {
    // enviando userId como query e token no header
    fetch(`http://localhost:8000/api/projects?user_id=${userId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(console.error)
  }, [])
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden">
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#625DF5] to-transparent p-6">
          <header className="w-full max-w-4xl flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-transparent px-6 py-3 shadow-sm mb-6 rounded-t-xl">
            <div className="flex items-center gap-3 text-white">
              <div className="inline-flex items-center justify-center bg-white rounded-full p-2">
                <img
                  src={logo}
                  alt="Logo"
                  className="w-20 h-20"
                  style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}
                />
              </div>

              <h1 className="text-2xl font-bold tracking-tight">Next_Page</h1>
            </div>
            <div className="flex flex-1 items-center justify-end gap-4">
              <label className="relative flex min-w-40 max-w-xs items-center">
                <input className="form-input w-full rounded-lg border-slate-300 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-500 focus:border-[#0c7ff2] focus:ring-[#0c7ff2]" placeholder="Search in projects" defaultValue="" />
              </label>
              <button className="flex min-w-[84px] items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#0c7ff2] px-4 py-2.5 text-sm font-semibold text-slate-50 transition-colors hover:bg-blue-600">
                <span className="truncate">New Project</span>
              </button>
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-slate-200" style={avatarStyle}></div>
            </div>
          </header>
          <main className="flex justify-center px-10 py-8">
            <div className="w-full max-w-7xl flex-col gap-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-white text-3xl font-bold">Your Projects</h1>
              </div>
              <div className="overflow-hidden rounded-lg border bg-white shadow-sm w-full">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Project Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Last Modified</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Main Branch</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {projects.map(proj => (
                      <tr key={proj.id}>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{proj.name}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{proj.last_modified}</td>
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
                            <button className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">
                              Edit
                            </button>
                            <button className="rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {projects.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-500">
                          No projects found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Projects
