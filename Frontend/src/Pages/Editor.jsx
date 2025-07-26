import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import TextAlign from '@tiptap/extension-text-align'
import { useParams } from 'react-router-dom'
import StarterKit from '@tiptap/starter-kit'
import Italic from '@tiptap/extension-italic'
import Heading from '@tiptap/extension-heading'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Underline from './Underline'
import PaginationExtension, { PageNode, HeaderFooterNode, BodyNode } from "tiptap-extension-pagination"
// Imagens
import logo from '../assets/logo1.png'
import loaderGif from '../assets/loader.gif'
import cloudIcon from '../assets/cloud.png'
import cloudOffIcon from '../assets/cloud-off.png'
import redo from '../assets/redo.png'
import save from '../assets/save.png'
import undo from '../assets/undo.png'
import center_align from '../assets/center-align.png'
import just_align from '../assets/justification.png'
import left_align from '../assets/left-align.png'
import right_align from '../assets/right-align.png'
import bold_font from '../assets/bold.png'
import italic_font from '../assets/italic.png'
import underline_font from '../assets/underline.png'

const pageStyle = { fontFamily: '"Roboto", "Noto Sans", sans-serif' }
const avatarStyle = {
  backgroundImage:
    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDm3TJQ2bsuTFWymc2Zk_ul_UFNWm9sNykIz-NMHhL0PoS12Fi486mWOZAn3_x22WDH8S0e4rhwVEmLCTpnn9njxyHcw1I_XeGkUReoLJH4uU6tSBqiAHt9mt0NycVBgx6EjInl8KMxpeLk83j0Y_FpT2REm6zfpNrhd_kVJvxKm2NU8HqgCSs0y84v--Shy1_kE_ZEqg1e8a22HZDG4b8vqbjg12BnuFRUk1gaNbl5ySWLhWKtgGNSnf6NVQhfHyjeDroohmI8BH5_")',
}

const alignButtons = [
  { img: left_align, alt: 'Alinhar à esquerda', action: 'alignLeft' },
  { img: center_align, alt: 'Centralizar texto', action: 'alignCenter' },
  { img: right_align, alt: 'Alinhar à direita', action: 'alignRight' },
  { img: just_align, alt: 'Justificar texto', action: 'alignJustify' },
]

const styleButtons = [
  { img: bold_font, alt: 'Negrito', action: 'bold' },
  { img: italic_font, alt: 'Itálico', action: 'italic' },
  { img: underline_font, alt: 'Sublinhar', action: 'underline' },
]

function Editor({ editable = true }) {
  const { id } = useParams()
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('Título do Documento')
  const [saveStatus, setSaveStatus] = useState('idle')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Extensões do Tiptap
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
  ]

  const editor = useEditor({
    extensions,
    content,
    editable,
    onUpdate({ editor }) {
      setContent(editor.getHTML())
    },
  })

  // Carrega o documento pelo id da URL
  useEffect(() => {
    fetch(`http://localhost:8000/api/load/${id}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data) => {
        const html = data.content || ''
        const loadedTitle = data.title || 'Título do Documento'
        setContent(html)
        setTitle(loadedTitle)
        if (editor) editor.commands.setContent(html)
      })
      .catch(() => {})
  }, [id, editor])

  // Salva automaticamente ao alterar content ou title
  useEffect(() => {
    if (!id) return
    setSaveStatus('saving')
    fetch(`http://localhost:8000/api/save/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, title }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('save failed')
        setSaveStatus('saved')
      })
      .catch(() => {
        setSaveStatus('error')
      })
  }, [content, title, id])

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

  return (
    <div className="bg-slate-100 flex flex-col min-h-screen" style={pageStyle}>
      {/* Header */}
      <header className="w-full max-w-6xl flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-transparent px-6 py-3 shadow-sm mb-6 rounded-t-xl mx-auto">
        <div className="flex items-center gap-3 text-slate-900">
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
            >
              <img src={undo} alt="undo" className="w-5 h-5" />
            </button>
            <button
              onClick={() => editor && editor.commands.redo()}
              className="flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
            >
              <img src={redo} alt="redo" className="w-5 h-5" />
            </button>
            <button
              onClick={() => editor && console.log(editor.getHTML())}
              className="flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
            >
              <img src={save} alt="save" className="w-5 h-5" />
            </button>
          </div>
          {/* Avatar */}
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border-2 border-white shadow-sm"
            style={avatarStyle}
          ></div>
        </div>
      </header>

      <main className="relative flex-1 max-w-6xl mx-auto px-6" style={{ minHeight: '60vh' }}>
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
                >
                  <option value="main">main</option>
                  <option value="feature-branch">feature-branch</option>
                  <option value="bugfix-xyz">bugfix-xyz</option>
                </select>
                <button className="flex items-center gap-1.5 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-md h-11 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium tracking-wide border border-slate-300 mt-2">
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
                  <p className="text-slate-800 text-sm font-medium line-clamp-1">
                    Added features section
                  </p>
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
                  defaultValue=""
                />
              </div>
              <button className="flex w-full items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-md h-11 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium tracking-wide shadow-sm transition-colors">
                <span className="material-icons-outlined text-lg">check_circle</span>
                <span>Commit Changes</span>
              </button>
            </div>
          </section>

          <section>
            <h3 className="text-slate-800 text-lg font-semibold pb-3 border-b border-slate-200 mb-3">
              Merge Branches
            </h3>
            <button className="flex w-full items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-md h-11 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium tracking-wide border border-slate-300">
              <span className="material-icons-outlined text-lg">merge_type</span>
              <span>Merge Branch</span>
            </button>
          </section>
        </aside>

        {/* Conteúdo principal */}
        <div className="flex flex-col rounded-xl bg-white p-8 shadow-2xl min-h-[60vh]">
          {/* Barra de ferramentas */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-2 bg-slate-50 rounded-t-lg mb-4">
            <div className="flex gap-2">
              {styleButtons.map(({ img, alt, action }) => (
                <button
                  key={alt}
                  type="button"
                  onClick={() => handleAction(action)}
                  className="rounded-md p-2 hover:bg-slate-200"
                  aria-label={alt}
                  title={alt}
                >
                  <img src={img} alt={alt} className="w-5 h-5" />
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {alignButtons.map(({ img, alt, action }) => (
                <button
                  key={alt}
                  type="button"
                  onClick={() => handleAction(action)}
                  className="rounded-md p-2 hover:bg-slate-200"
                  aria-label={alt}
                  title={alt}
                >
                  <img src={img} alt={alt} className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Título do documento */}
          <label htmlFor="doc-title" className="mb-1 text-lg font-semibold text-gray-700 select-none">
            Título do Documento
          </label>
          <input
            id="doc-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite o título do documento"
            className="mb-6 text-3xl font-bold outline-none border-none w-full px-2 py-1 text-gray-800 placeholder-gray-400 bg-transparent"
          />

          {/* EditorContent */}
          <EditorContent
            editor={editor}
            className="w-full h-full outline-none text-black flex-grow p-10"
          />
        </div>
      </main>
    </div>
  )
}

export default Editor
