import { useState } from 'react'

function Commits() {
  const [collapsed, setCollapsed] = useState(false)
  const pageStyle = { fontFamily: 'Manrope, "Noto Sans", sans-serif' }
  const avatarStyle = { backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCJLprAJa3yxpkdVMZGlXHe4RrIIFE0EmMlkrwcRjDzvxNOitSm7qS5QmGcFCNWrxyjfwQH25sYeCVkY5_engwX7T4-pp0OQNZQQa5F73wbq1xrYWdhyH6y6-IKtcgeuFB9Od6U9rbfxaSE4OqnsSC3lCsMEYz4OJ8MMNEKRFoxlWT4P3V1oOqLV9ALwcQS5vvN4-RF5Z68_82s3zKxmZuGQ80k-OilegyeKXY9ZAywOGr54BYQDRN0lLbfyDumBPZ840ELZ8QPXap3")' }

  return (
    <div className="bg-slate-100" style={pageStyle}>
      <div className={`relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden ${collapsed ? 'is-collapsed' : ''}`}> 
        <div className="flex h-full grow flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-white px-6 py-3 shadow-sm">
            <div className="flex items-center gap-3 text-slate-800">
              <svg fill="none" height="32" viewBox="0 0 48 48" width="32" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="#0C7FF2" />
              </svg>
              <h1 className="text-slate-800 text-xl font-bold leading-tight tracking-[-0.015em]">CodeCollab</h1>
            </div>
            <nav className="flex flex-1 justify-center gap-6">
              <a className="text-slate-600 hover:text-[#0C7FF2] text-sm font-medium leading-normal transition-colors" href="#">File</a>
              <a className="text-slate-600 hover:text-[#0C7FF2] text-sm font-medium leading-normal transition-colors" href="#">Edit</a>
              <a className="text-slate-600 hover:text-[#0C7FF2] text-sm font-medium leading-normal transition-colors" href="#">View</a>
              <a className="text-slate-600 hover:text-[#0C7FF2] text-sm font-medium leading-normal transition-colors" href="#">Insert</a>
              <a className="text-slate-600 hover:text-[#0C7FF2] text-sm font-medium leading-normal transition-colors" href="#">Format</a>
              <a className="text-slate-600 hover:text-[#0C7FF2] text-sm font-medium leading-normal transition-colors" href="#">Tools</a>
            </nav>
            <div className="flex items-center gap-4">
              <button aria-label="Notifications" className="flex items-center justify-center rounded-full h-10 w-10 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-colors">
                <span className="material-icons text-xl">notifications</span>
              </button>
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-slate-200 hover:border-[#0C7FF2] transition-colors cursor-pointer" style={avatarStyle}></div>
            </div>
          </header>
          <main className="flex flex-1 gap-4 p-4 lg:p-6">
            <aside className="relative w-80 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col group-[.is-collapsed_&]:hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h2 className="text-slate-800 text-lg font-semibold">Commits</h2>
                <button aria-label="Collapse panel" className="text-slate-500 hover:text-[#0C7FF2] transition-colors group-[.is-collapsed_&]:rotate-180" onClick={() => setCollapsed(!collapsed)}>
                  <span className="material-icons">chevron_left</span>
                </button>
              </div>
              <div className="overflow-y-auto flex-1">
                <ul className="divide-y divide-slate-200">
                  <li className="hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-3 p-4">
                      <span className="material-icons text-slate-400 text-2xl">history</span>
                      <div className="flex-1">
                        <p className="text-slate-700 text-sm font-medium leading-snug line-clamp-1">Initial commit</p>
                        <p className="text-slate-500 text-xs font-normal leading-snug line-clamp-1">feat: add commit history panel</p>
                      </div>
                      <div className="shrink-0"><p className="text-slate-400 text-xs font-normal">2 days ago</p></div>
                    </div>
                  </li>
                  <li className="hover:bg-slate-50 cursor-pointer bg-sky-50 border-l-2 border-[#0C7FF2]">
                    <div className="flex items-center gap-3 p-4">
                      <span className="material-icons text-[#0C7FF2] text-2xl">history</span>
                      <div className="flex-1">
                        <p className="text-[#0C7FF2] text-sm font-semibold leading-snug line-clamp-1">Merge branch 'feature/new-feature'</p>
                        <p className="text-slate-600 text-xs font-normal leading-snug line-clamp-1">fix: resolve merge conflicts</p>
                      </div>
                      <div className="shrink-0"><p className="text-slate-500 text-xs font-normal">1 day ago</p></div>
                    </div>
                  </li>
                  <li className="hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-3 p-4">
                      <span className="material-icons text-slate-400 text-2xl">history</span>
                      <div className="flex-1">
                        <p className="text-slate-700 text-sm font-medium leading-snug line-clamp-1">Update UI styles</p>
                        <p className="text-slate-500 text-xs font-normal leading-snug line-clamp-1">style: improve UI responsiveness</p>
                      </div>
                      <div className="shrink-0"><p className="text-slate-400 text-xs font-normal">12 hours ago</p></div>
                    </div>
                  </li>
                  <li className="hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-3 p-4">
                      <span className="material-icons text-slate-400 text-2xl">history</span>
                      <div className="flex-1">
                        <p className="text-slate-700 text-sm font-medium leading-snug line-clamp-1">Update documentation</p>
                        <p className="text-slate-500 text-xs font-normal leading-snug line-clamp-1">docs: update documentation</p>
                      </div>
                      <div className="shrink-0"><p className="text-slate-400 text-xs font-normal">2 hours ago</p></div>
                    </div>
                  </li>
                  <li className="hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-3 p-4">
                      <span className="material-icons text-slate-400 text-2xl">history</span>
                      <div className="flex-1">
                        <p className="text-slate-700 text-sm font-medium leading-snug line-clamp-1">Implement real-time collaboration</p>
                        <p className="text-slate-500 text-xs font-normal leading-snug line-clamp-1">feat: add real-time collaboration</p>
                      </div>
                      <div className="shrink-0"><p className="text-slate-400 text-xs font-normal">1 hour ago</p></div>
                    </div>
                  </li>
                </ul>
              </div>
              <button aria-label="Expand panel" className="absolute top-4 right-4 text-slate-500 hover:text-[#0C7FF2] transition-colors hidden group-[.is-collapsed_&]:block" onClick={() => setCollapsed(false)}>
                <span className="material-icons">chevron_right</span>
              </button>
            </aside>
            <section className="flex-1 bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col">
              <div className="p-4 border-b border-slate-200">
                <label className="flex items-center w-full rounded-md h-10 bg-slate-100 focus-within:ring-2 focus-within:ring-[#0C7FF2] transition-all">
                  <span className="material-icons text-slate-500 pl-3">description</span>
                  <input className="form-input flex-1 min-w-0 resize-none overflow-hidden rounded-md text-slate-800 focus:outline-none focus:ring-0 border-none bg-transparent h-full placeholder:text-slate-400 px-2 text-sm font-medium" defaultValue="Untitled Document" />
                  <button aria-label="Clear document name" className="text-slate-400 hover:text-slate-600 transition-colors pr-3">
                    <span className="material-icons text-lg">close</span>
                  </button>
                </label>
              </div>
              <div className="p-4">
                <textarea className="form-input w-full min-h-[calc(100vh-280px)] resize-none overflow-hidden rounded-md text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0C7FF2] border border-slate-200 bg-slate-50 placeholder:text-slate-400 p-4 text-base font-normal leading-relaxed" placeholder="Start typing your document here..." />
              </div>
              <div className="border-t border-slate-200 p-3 mt-auto">
                <div className="flex flex-wrap items-center gap-2 justify-start">
                  <button className="flex flex-col items-center gap-1.5 text-center w-20 p-2 rounded-md hover:bg-slate-100 transition-colors text-slate-600 hover:text-[#0C7FF2]">
                    <span className="material-icons text-xl">save</span>
                    <p className="text-xs font-medium">Save</p>
                  </button>
                  <button className="flex flex-col items-center gap-1.5 text-center w-20 p-2 rounded-md hover:bg-slate-100 transition-colors text-slate-600 hover:text-[#0C7FF2]">
                    <span className="material-icons text-xl">edit</span>
                    <p className="text-xs font-medium">Edit</p>
                  </button>
                  <button className="flex flex-col items-center gap-1.5 text-center w-20 p-2 rounded-md hover:bg-slate-100 transition-colors text-slate-600 hover:text-[#0C7FF2]">
                    <span className="material-icons text-xl">share</span>
                    <p className="text-xs font-medium">Share</p>
                  </button>
                  <button className="flex flex-col items-center gap-1.5 text-center w-20 p-2 rounded-md hover:bg-slate-100 transition-colors text-slate-600 hover:text-[#0C7FF2]">
                    <span className="material-icons text-xl">download</span>
                    <p className="text-xs font-medium">Download</p>
                  </button>
                  <button className="flex flex-col items-center gap-1.5 text-center w-20 p-2 rounded-md hover:bg-slate-100 transition-colors text-slate-600 hover:text-[#0C7FF2]">
                    <span className="material-icons text-xl">print</span>
                    <p className="text-xs font-medium">Print</p>
                  </button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Commits
