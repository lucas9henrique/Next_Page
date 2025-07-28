function Editorgit() {
  const pageStyle = { fontFamily: 'Manrope, "Noto Sans", sans-serif', '--select-button-svg': "url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(73,115,156)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e')" }
  const avatarStyle = { backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBw2MYSYuTRVOCD46HudIbON2Dma4zx1naGd9dZLFTEdOa72QUQZj2Yq_RSdsI46_uDD50Amm7_4E2EVn5GYu0E2OAsGRTaHuQuxgwy_xJULBJIWT8vwJaOjJ6DeV7QfLCSszm8-JNJnivnvX3iAaplIXGN_a0YxHTA3lw01XUF8-WQJssyTPPP3z4itc9THfzIZQT2U0kQ4SU0S1XSejj2LOfd9066bErXumtjSjFuxWTBF6kqPLEO7y1GYkk_wjTjWZRzrs3M88YH")' }
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50 group/design-root overflow-x-hidden" style={pageStyle}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-slate-200 px-6 py-3 shadow-sm">
          <div className="flex items-center gap-3 text-slate-800">
            <div className="size-7 text-blue-600">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor" />
              </svg>
            </div>
            <h1 className="text-slate-800 text-xl font-bold">CodeCollab</h1>
          </div>
          <div className="flex flex-1 justify-end items-center gap-6">
            <nav className="flex items-center gap-5">
              <a className="text-slate-700 hover:text-blue-600 text-sm font-medium" href="#">File</a>
              <a className="text-slate-700 hover:text-blue-600 text-sm font-medium" href="#">Edit</a>
              <a className="text-slate-700 hover:text-blue-600 text-sm font-medium" href="#">View</a>
              <a className="text-slate-700 hover:text-blue-600 text-sm font-medium" href="#">Insert</a>
              <a className="text-slate-700 hover:text-blue-600 text-sm font-medium" href="#">Format</a>
              <a className="text-slate-700 hover:text-blue-600 text-sm font-medium" href="#">Tools</a>
            </nav>
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border-2 border-slate-200 shadow-sm" style={avatarStyle}></div>
          </div>
        </header>
        <main className="flex flex-1">
          <div className="flex-1 p-6 @container">
            <div className="bg-white rounded-lg shadow-lg p-6 h-full">
              <label className="flex flex-col h-full">
                <p className="text-slate-800 text-lg font-semibold pb-3">Document Content</p>
                <textarea className="form-input flex w-full min-w-0 flex-1 resize-none overflow-auto rounded-md text-slate-800 focus:outline-0 focus:ring-2 focus:ring-blue-500 border border-slate-300 bg-slate-50 focus:border-blue-500 min-h-96 placeholder:text-slate-400 p-4 text-base font-normal leading-relaxed" placeholder="Start typing your document here..."></textarea>
              </label>
            </div>
          </div>
          <aside className="w-[380px] bg-white border-l border-slate-200 shadow-lg p-6 space-y-6 overflow-y-auto">
            <section>
              <h2 className="text-slate-800 text-xl font-bold pb-4 border-b border-slate-200 mb-4">Git Control</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 text-sm font-medium pb-1.5" htmlFor="current-branch">Current Branch</label>
                  <div className="flex items-center gap-2">
                    <select className="form-select flex-1 w-full rounded-md text-slate-800 focus:outline-0 focus:ring-2 focus:ring-blue-500 border border-slate-300 bg-slate-50 focus:border-blue-500 h-11 bg-[image:--select-button-svg] placeholder:text-slate-400 px-3 text-sm" id="current-branch">
                      <option value="main">main</option>
                      <option value="feature-branch">feature-branch</option>
                      <option value="bugfix-xyz">bugfix-xyz</option>
                    </select>
                    <button className="flex items-center gap-1.5 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-md h-11 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium tracking-wide border border-slate-300">
                      <span className="material-icons-outlined text-lg">add</span>
                      <span>New</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
            <section>
              <h3 className="text-slate-800 text-lg font-semibold pb-3 border-b border-slate-200 mb-3">Commit History</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                <div className="flex items-center gap-3 p-3 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors">
                  <div className="flex-shrink-0 size-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                    <span className="material-icons-outlined text-xl">history</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-800 text-sm font-medium line-clamp-1">Initial commit</p>
                    <p className="text-slate-500 text-xs line-clamp-1">Author: Alex Bennett</p>
                  </div>
                  <p className="text-slate-500 text-xs shrink-0">2 days ago</p>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors">
                  <div className="flex-shrink-0 size-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                    <span className="material-icons-outlined text-xl">history</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-800 text-sm font-medium line-clamp-1">Added features section</p>
                    <p className="text-slate-500 text-xs line-clamp-1">Author: Sophia Carter</p>
                  </div>
                  <p className="text-slate-500 text-xs shrink-0">1 day ago</p>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors">
                  <div className="flex-shrink-0 size-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                    <span className="material-icons-outlined text-xl">history</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-800 text-sm font-medium line-clamp-1">Updated documentation</p>
                    <p className="text-slate-500 text-xs line-clamp-1">Author: Alex Bennett</p>
                  </div>
                  <p className="text-slate-500 text-xs shrink-0">1 hour ago</p>
                </div>
              </div>
            </section>
            <section>
              <h3 className="text-slate-800 text-lg font-semibold pb-3 border-b border-slate-200 mb-3">Commit Changes</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-700 text-sm font-medium pb-1.5" htmlFor="commit-message">Commit Message</label>
                  <input className="form-input w-full rounded-md text-slate-800 focus:outline-0 focus:ring-2 focus:ring-blue-500 border border-slate-300 bg-slate-50 focus:border-blue-500 h-11 placeholder:text-slate-400 px-3 text-sm" id="commit-message" placeholder="Enter your commit message" defaultValue="" />
                </div>
                <button className="flex w-full items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-md h-11 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium tracking-wide shadow-sm transition-colors">
                  <span className="material-icons-outlined text-lg">check_circle</span>
                  <span>Commit Changes</span>
                </button>
              </div>
            </section>
            <section>
              <h3 className="text-slate-800 text-lg font-semibold pb-3 border-b border-slate-200 mb-3">Merge Branches</h3>
              <button className="flex w-full items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-md h-11 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium tracking-wide border border-slate-300 transition-colors">
                <span className="material-icons-outlined text-lg">merge_type</span>
                <span>Open Merge Modal</span>
              </button>
            </section>
          </aside>
        </main>
      </div>
    </div>
  )
}

export default Editorgit
