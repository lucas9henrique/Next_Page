function Projects() {
  const pageStyle = { fontFamily: 'Manrope, "Noto Sans", sans-serif' }
  const avatarStyle = { backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCB6kVfzkQcBJF-8Zr1op7XJrlSN3T2Agi9wDUjMD68R0N8sGPe8esmtrBe0JADQKJJNPDaHqftmNjQc8WBlB0yIBrHYinma-jSOvQDGlZBAastI2-ktuyE8nMxLq5J0CTRHeom7baiN7PQ7AYWJUFmlpj66JHXQDEE066jct78l4twgYMkhwRWT6GpqeEOC6q9iCo35PZQjyoz9L468FVYYBWX4zFUL-hLHYCiWpt4P_DwAMPsipIFakokvPswucCpsbF-6Efpk7xl")' }
  return (
    <div className="bg-slate-50" style={pageStyle}>
      <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 px-10 py-3">
            <div className="flex items-center gap-3 text-slate-900">
              <svg className="size-7 text-[#0c7ff2]" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor" />
              </svg>
              <h2 className="text-slate-900 text-xl font-bold leading-tight tracking-[-0.015em]">CodeCollab</h2>
            </div>
            <div className="flex flex-1 items-center justify-end gap-4">
              <label className="relative flex min-w-40 max-w-xs items-center">
                <span className="material-icons-outlined absolute left-3 text-slate-500">search</span>
                <input className="form-input w-full rounded-lg border-slate-300 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-500 focus:border-[#0c7ff2] focus:ring-[#0c7ff2]" placeholder="Search in projects" defaultValue="" />
              </label>
              <button className="flex min-w-[84px] items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#0c7ff2] px-4 py-2.5 text-sm font-semibold text-slate-50 transition-colors hover:bg-blue-600">
                <span className="material-icons-round text-lg">add_circle_outline</span>
                <span className="truncate">New Project</span>
              </button>
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-slate-200" style={avatarStyle}></div>
            </div>
          </header>
          <main className="flex flex-1 justify-center px-10 py-8">
            <div className="layout-content-container flex w-full max-w-6xl flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-slate-900 text-3xl font-bold leading-tight">Your Projects</h1>
              </div>
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="w-2/5 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500" scope="col">Project Name</th>
                      <th className="w-1/5 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500" scope="col">Last Modified</th>
                      <th className="w-1/5 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500" scope="col">Main Branch</th>
                      <th className="w-1/5 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500" scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    <tr>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">Project Alpha</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">2024-01-15</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          <span className="material-icons-round mr-1 text-sm">call_split</span>
                          main
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-1.5 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors">
                            <span className="material-icons-outlined text-sm">edit</span>
                            Edit
                          </button>
                          <button className="flex items-center gap-1.5 rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors">
                            <span className="material-icons-outlined text-sm">delete</span>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">Project Beta</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">2024-02-20</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          <span className="material-icons-round mr-1 text-sm">call_split</span>
                          master
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-1.5 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors">
                            <span className="material-icons-outlined text-sm">edit</span>
                            Edit
                          </button>
                          <button className="flex items-center gap-1.5 rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors">
                            <span className="material-icons-outlined text-sm">delete</span>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">Project Gamma</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">2024-03-10</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          <span className="material-icons-round mr-1 text-sm">call_split</span>
                          main
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-1.5 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors">
                            <span className="material-icons-outlined text-sm">edit</span>
                            Edit
                          </button>
                          <button className="flex items-center gap-1.5 rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors">
                            <span className="material-icons-outlined text-sm">delete</span>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">Project Delta</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">2024-04-05</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          <span className="material-icons-round mr-1 text-sm">call_split</span>
                          master
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-1.5 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors">
                            <span className="material-icons-outlined text-sm">edit</span>
                            Edit
                          </button>
                          <button className="flex items-center gap-1.5 rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors">
                            <span className="material-icons-outlined text-sm">delete</span>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">Project Epsilon</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">2024-05-01</td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          <span className="material-icons-round mr-1 text-sm">call_split</span>
                          main
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button className="flex items-center gap-1.5 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors">
                            <span className="material-icons-outlined text-sm">edit</span>
                            Edit
                          </button>
                          <button className="flex items-center gap-1.5 rounded-md bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors">
                            <span className="material-icons-outlined text-sm">delete</span>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
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
