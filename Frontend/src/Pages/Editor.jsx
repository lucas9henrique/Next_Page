import { useState, useEffect, useContext, useCallback, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import TextAlign from '@tiptap/extension-text-align'
import { useParams, useNavigate } from 'react-router-dom'
import StarterKit from '@tiptap/starter-kit'
import Italic from '@tiptap/extension-italic'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Underline from './Underline'
import { UserContext } from './UserContext.jsx'
import PaginationExtension, { PageNode, HeaderFooterNode, BodyNode } from "tiptap-extension-pagination";
// Imagens
// — Geral
import logo from '../assets/logo1.png';
import loaderGif from '../assets/loader.gif';
import cloudIcon from '../assets/cloud.png';
import cloudOffIcon from '../assets/cloud-off.png';
// — Ações de edição
import redo from '../assets/redo.png';
import save from '../assets/save.png';
import undo from '../assets/undo.png';
import share from '../assets/compartilhar.png';
// — Alinhamento de texto
import center_align from '../assets/center-align.png';
import just_align from '../assets/justification.png';
import left_align from '../assets/left-align.png';
import right_align from '../assets/right-align.png';
// — Estilo de fonte
import bold_font from '../assets/bold.png';
import italic_font from '../assets/italic.png';
import underline_font from '../assets/underline.png';

const pageStyle = { fontFamily: '"Roboto", "Noto Sans", sans-serif' };
const avatarStyle = {
  backgroundImage:
    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDm3TJQ2bsuTFWymc2Zk_ul_UFNWm9sNykIz-NMHhL0PoS12Fi486mWOZAn3_x22WDH8S0e4rhwVEmLCTpnn9njxyHcw1I_XeGkUReoLJH4uU6tSBqiAHt9mt0NycVBgx6EjInl8KMxpeLk83j0Y_FpT2REm6zfpNrhd_kVJvxKm2NU8HqgCSs0y84v--Shy1_kE_ZEqg1e8a22HZDG4b8vqbjg12BnuFRUk1gaNbl5ySWLhWKtgGNSnf6NVQhfHyjeDroohmI8BH5_")',
};

const alignButtons = [
  { img: left_align, alt: 'Alinhar à esquerda', action: 'alignLeft' },
  { img: center_align, alt: 'Centralizar texto', action: 'alignCenter' },
  { img: right_align, alt: 'Alinhar à direita', action: 'alignRight' },
  { img: just_align, alt: 'Justificar texto', action: 'alignJustify' },]

const styleButtons = [
  { img: bold_font, alt: 'Negrito', action: 'bold' },
  { img: italic_font, alt: 'Itálico', action: 'italic' },
  { img: underline_font, alt: 'Sublinhar', action: 'underline' },
]

function Editor({ editable = true }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [saveStatus, setSaveStatus] = useState('idle')
  const [shareCode, setShareCode] = useState('')
  const [shareOpen, setShareOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const shareRef = useRef(null)
  const shareButtonRef = useRef(null)
  const { userId, token } = useContext(UserContext)
  const [branches, setBranches] = useState([])
  const [currentBranch, setCurrentBranch] = useState('main')
  const [commitMessage, setCommitMessage] = useState('')
  const [commits, setCommits] = useState([])

  /* extensões que o Tiptap deve carregar */
  const extensions = [
    StarterKit.configure({
      italic: false,
      heading: false,
      bulletList: false,
      orderedList: false,
      listItem: false,
    }),
    Italic.configure({
      HTMLAttributes: { class: 'italic' },
    }),
    Heading.configure({
      levels: [1, 2, 3],
      HTMLAttributes: { class: 'text-2xl font-semibold' },
    }),
    BulletList.configure({
      HTMLAttributes: { class: 'list-disc list-outside pl-5 my-2' },
    }),
    OrderedList.configure({
      HTMLAttributes: { class: 'list-decimal list-outside pl-5 my-2' },
    }),
    ListItem,
    Underline,
    PaginationExtension.configure({
      pageAmendmentOptions: {
        enableHeader: false,
        enableFooter: false,
      },
      BorderConfig: { top: 0, right: 0, bottom: 0, left: 0 },
    }),
    TextAlign.configure({
      types: ['paragraph', 'heading'],
    }),
    PageNode,
    HeaderFooterNode,
    BodyNode,
  ];

  const editor = useEditor({
    extensions,
    content,
    editable,
    onUpdate({ editor }) {
      setContent(editor.getHTML())
    },
  })

  const fetchBranches = useCallback(() => {
    fetch(`http://localhost:8000/api/branches/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setBranches(Array.isArray(data) ? data : [])
        if (Array.isArray(data) && data.length && !data.includes(currentBranch)) {
          setCurrentBranch(data[0])
        }
      })
      .catch(() => {})
  }, [id, token, currentBranch])

  const fetchHistory = useCallback(() => {
    fetch(`http://localhost:8000/api/history/${id}?branch=${currentBranch}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setCommits(Array.isArray(data) ? data : []))
      .catch(() => setCommits([]))
  }, [id, currentBranch, token])

  useEffect(() => {
    fetchBranches()
  }, [fetchBranches])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  useEffect(() => {
    fetch(`http://localhost:8000/api/load/${id}?branch=${currentBranch}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then((data) => {
        const html = data.content || ''
        setContent(html)
        if (editor) {
          editor.commands.setContent(html)
        }
      })
      .catch(() => { })
  }, [id, currentBranch, editor, token])

  const saveContent = useCallback((message) => {
    if (!id) return
    setSaveStatus('saving')
    return fetch(`http://localhost:8000/api/save/${id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content, message, branch: currentBranch }),
      })
      .then(res => {
        if (!res.ok) throw new Error('save failed')
        setSaveStatus('saved')
      })
      .catch(() => {
        setSaveStatus('error')
      })
  }, [content, id, token, currentBranch])

  useEffect(() => {
    const handler = setTimeout(() => {
      saveContent()
    }, 1000)
    return () => clearTimeout(handler)
  }, [content, saveContent])

  useEffect(() => {
    if (!shareOpen) return
    function handleOutside(event) {
      if (
        shareRef.current &&
        !shareRef.current.contains(event.target) &&
        shareButtonRef.current &&
        !shareButtonRef.current.contains(event.target)
      ) {
        setShareOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [shareOpen])

  const handleAction = (type) => {
    if (!editor) return
    const chain = editor.chain().focus()
    switch (type) {
      case 'bold':
        chain.toggleBold().run()
        break
      case 'italic':
        chain.toggleItalic().run()
        break
      case 'underline':
        chain.toggleUnderline().run()
        break
      case 'heading2':
        chain.toggleHeading({ level: 2 }).run()
        break
      case 'bulletList':
        chain.toggleBulletList().run()
        break
      case 'orderedList':
        chain.toggleOrderedList().run()
        break
      case 'alignLeft':
        chain.setTextAlign('left').run()
        break
      case 'alignCenter':
        chain.setTextAlign('center').run()
        break
      case 'alignRight':
        chain.setTextAlign('right').run()
        break
      case 'alignJustify':
        chain.setTextAlign('justify').run()
        break
      default:
        break
    }
  }
  const handleJoin = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/documents/${id}/add_user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ email: shareCode.trim()})
        });
    
        if (!response.ok) {
          throw new Error('Erro ao adicionar usuário');
        }
        else{
          setShareOpen(false)
        }
      } catch (err) {
        console.error('Erro ao adicionar usuário:', err);
        alert('Não foi possível adicionar o usuário.');
      }
    };
  return (
    <div className="bg-slate-100" style={pageStyle}>
      {/* Botão fixo para abrir/fechar sidebar */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-20 left-4 z-[1001] rounded-md bg-blue-600 p-2 text-white shadow-md transition-colors hover:bg-blue-700 flex items-center justify-center"
        aria-label={sidebarOpen ? 'Fechar sidebar' : 'Abrir sidebar'}
      >
        {/* Ícone hamburguer e X */}
        {sidebarOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Overlay escurecido atrás da sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-[1000] transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar fixa sobreposta */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-slate-200 shadow-2xl p-6 overflow-y-auto transition-transform duration-300 ease-in-out z-[1002]`}
        style={{
          width: 480,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-480px)',
        }}
      >
        <section>
          <h2 className="text-slate-800 text-xl font-bold pb-4 border-b border-slate-200 mb-4">
            Git Control
          </h2>
          <div className="space-y-4">
            <div>
              <label
                className="block text-slate-700 text-sm font-medium pb-1.5"
                htmlFor="current-branch"
              >
                Current Branch
              </label>
              <select
                className="form-select flex-1 w-full rounded-md text-slate-800 focus:outline-0 focus:ring-2 focus:ring-blue-500 border border-slate-300 bg-slate-50 focus:border-blue-500 h-11 bg-[image:--select-button-svg] placeholder:text-slate-400 px-3 text-sm"
                id="current-branch"
                value={currentBranch}
                onChange={(e) => { setCurrentBranch(e.target.value) }}
              >
                {branches.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  const name = prompt('New branch name')
                  if (name) {
                    fetch('http://localhost:8000/api/branches', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                      },
                      body: JSON.stringify({ document: id, branch: name })
                    }).then(res => {
                      if (res.ok) {
                        fetchBranches()
                      }
                    })
                  }
                }}
                className="flex items-center gap-1.5 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-md h-11 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium tracking-wide border border-slate-300 mt-2">
                <span className="material-icons-outlined text-lg">add</span>
                <span>New</span>
              </button>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-slate-800 text-lg font-semibold pb-3 border-b border-slate-200 mb-3">
            Commit History
          </h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {commits.map(c => (
              <div key={c.hash} className="flex items-center gap-3 p-3 rounded-md border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="flex-shrink-0 size-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                  <span className="material-icons-outlined text-xl">history</span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-800 text-sm font-medium line-clamp-1">{c.message}</p>
                  <p className="text-slate-500 text-xs line-clamp-1">Author: {c.author}</p>
                </div>
                <p className="text-slate-500 text-xs shrink-0">{new Date(c.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-slate-800 text-lg font-semibold pb-3 border-b border-slate-200 mb-3">
            Commit Changes
          </h3>
          <div className="space-y-3">
            <div>
              <label
                className="block text-slate-700 text-sm font-medium pb-1.5"
                htmlFor="commit-message"
              >
                Commit Message
              </label>
              <input
                className="form-input w-full rounded-md text-slate-800 focus:outline-0 focus:ring-2 focus:ring-blue-500 border border-slate-300 bg-slate-50 focus:border-blue-500 h-11 placeholder:text-slate-400 px-3 text-sm"
                id="commit-message"
                placeholder="Enter your commit message"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
              />
            </div>
            <button
              onClick={() => {
                saveContent(commitMessage).then(() => {
                  setCommitMessage('')
                  fetchHistory()
                })
              }}
              className="flex w-full items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-md h-11 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium tracking-wide shadow-sm transition-colors">
              <span className="material-icons-outlined text-lg">check_circle</span>
              <span>Commit Changes</span>
            </button>
          </div>
        </section>

        <section>
          <h3 className="text-slate-800 text-lg font-semibold pb-3 border-b border-slate-200 mb-3">
            Merge Branches
          </h3>
          <button
            onClick={() => {
              const source = prompt(`Merge which branch into ${currentBranch}?`)
              if (source) {
                fetch('http://localhost:8000/api/merge', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                  },
                  body: JSON.stringify({ document: id, source, target: currentBranch })
                }).then(res => {
                  if (res.ok) {
                    fetchHistory()
                    fetchBranches()
                  }
                })
              }
            }}
            className="flex w-full items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-md h-11 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium tracking-wide border border-slate-300">
            <span className="material-icons-outlined text-lg">merge_type</span>
            <span>Merge Branch</span>
          </button>
        </section>
      </aside>

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
          <div className="flex flex-1 items-center justify-end gap-6 relative">
            {/* Botões de ação */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => editor && editor.commands.undo()}
                className="flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
              > <img
                  src={undo}
                  alt="undo"
                  className="w-5 h-5"
                />
              </button>
              <button
                onClick={() => editor && editor.commands.redo()}
                className="flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
              > <img
                  src={redo}
                  alt="redo"
                  className="w-5 h-5"
                />
              </button>
              <button
                onClick={() => {
                  saveContent().then(fetchHistory)
                }}
                className="flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"           >
                <img
                  src={save}
                  alt="save"
                  className="w-5 h-5"
                />
              </button>
              <div className="relative">
                <button
                  ref={shareButtonRef}
                  onClick={() => setShareOpen(true)}
                  className="flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"           >
                  <img
                    src={share}
                    alt="share"
                    className="w-5 h-5"
                  />
                </button>
                {shareOpen && (
                  <div
                    ref={shareRef}
                    className="absolute right-0 top-full mt-2 bg-white border rounded shadow p-2"
                  >
                    <input
                      type="text"
                      value={shareCode}
                      onChange={(e) => setShareCode(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleJoin()
                      }}
                      placeholder="Código"
                      className="border rounded px-2 py-1 text-sm text-slate-800"
                    />
                    <button
                      onClick={handleJoin}
                      className="ml-2 rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
                    >
                      Adicionar
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Avatar */}
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border-2 border-white shadow-sm"
              style={avatarStyle}
            ></div>
          </div>
        </header>
        {/* Editor */}
        <div className="w-full max-w-4xl rounded-xl bg-white p-8 shadow-2xl flex flex-col min-h-[60vh]">
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-2 bg-slate-50 rounded-t-lg -mx-8 -mt-8 mb-4">
            <div className="flex items-center gap-1">
              {/* Botões de fonte */}
              {styleButtons.map(({ img, alt, action }) => (
                <button
                  key={action}
                  onClick={() => handleAction(action)}
                  className={`
        p-2 rounded-md transition-colors
        ${editor?.isActive(action)
                      ? 'bg-slate-200'
                      : 'hover:bg-slate-200'}`}>
                  <img src={img} alt={alt} className="w-4 h-4" />
                </button>
              ))}
              {/* Botões de texto */}
              <div className="h-5 w-px bg-slate-300 mx-1"></div>
              <button
                onClick={() => handleAction('heading2')}
                className={`p-2 rounded-md ${editor?.isActive('heading', { level: 2 }) ? 'bg-slate-200 text-slate-800' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                  } transition-colors`}
              >
                <span className="font-bold">H2</span>
              </button>
              <button
                onClick={() => handleAction('bulletList')}
                className={`p-2 rounded-md ${editor?.isActive('bulletList') ? 'bg-slate-200 text-slate-800' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                  } transition-colors`}
              >
                <span>&bull;</span>
              </button>
              <button
                onClick={() => handleAction('orderedList')}
                className={`p-2 rounded-md ${editor?.isActive('orderedList') ? 'bg-slate-200 text-slate-800' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                  } transition-colors`}
              >
                <span>1.</span>
              </button>
              <div className="h-5 w-px bg-slate-300 mx-1"></div>
              <div className="flex items-center gap-2">
                {alignButtons.map(({ img, alt, action }) => (
                  <button
                    key={action}
                    onClick={() => handleAction(action)}
                    className={`
          p-2 rounded-md transition-colors
          ${editor?.isActive({ textAlign: action.replace('align', '').toLowerCase() })
                        ? 'bg-slate-200'
                        : 'hover:bg-slate-200'
                      } `}
                  >
                    <img src={img} alt={alt} className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
            {/* salvamento */}
            <div className="flex items-center gap-2 text-sm">
              {saveStatus === 'saving' && (
                <img src={loaderGif} alt="Salvando..." className="w-5 h-5 animate-spin" />
              )}
              {saveStatus === 'saved' && (
                <>
                  <img
                    src={cloudIcon}
                    alt="Salvo"
                    className="w-5 h-5"
                  />
                  <span className="text-green-400">Salvo</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <img
                    src={cloudOffIcon}
                    alt="Erro ao salvar"
                    className="w-5 h-5"
                  />
                  <span className="text-red-400">Erro ao salvar</span>
                </>
              )}
              {saveStatus === 'idle' && (
                <img
                  src={cloudIcon}
                  alt="Pronto"
                  className="w-5 h-5 text-gray-400"
                />
              )}
            </div>

            {/* editor de texto */}
          </div>
          <EditorContent editor={editor} className="w-full h-full outline-none text-black flex-grow p-10" />
        </div>

        {/* Rodapé */}
        <footer className="mt-10 text-center text-sm text-slate-400">
          <p>© 2025 CodeCollab. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
export default Editor;

