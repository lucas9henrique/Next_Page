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
import PaginationExtension, { PageNode, HeaderFooterNode, BodyNode } from "tiptap-extension-pagination";
// Imagens
// — Geral
import logo          from '../assets/logo1.png';
import loaderGif     from '../assets/loader.gif';
import cloudIcon     from '../assets/cloud.png';
import cloudOffIcon  from '../assets/cloud-off.png';
// — Ações de edição
import redo          from '../assets/redo.png';
import save          from '../assets/save.png';
import undo          from '../assets/undo.png';
// — Alinhamento de texto
import center_align  from '../assets/center-align.png';
import just_align    from '../assets/justification.png';
import left_align    from '../assets/left-align.png';
import right_align   from '../assets/right-align.png';
// — Estilo de fonte
import bold_font     from '../assets/bold.png';
import italic_font   from '../assets/italic.png';
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
  });

  useEffect(() => {
    fetch(`http://localhost:8000/api/load/${id}`)
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then((data) => {
        const html = data.content || ''
        const loadedTitle = data.title || 'Título do Documento'
        setContent(html)
        setTitle(loadedTitle)
        if (editor) {
          editor.commands.setContent(html)
        }
      })
      .catch(() => { })
  }, [id, editor])

  useEffect(() => {
    if (!id) return
    setSaveStatus('saving')
    fetch(`http://localhost:8000/api/save/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, title }),
    })
      .then(res => {
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
    <div className="bg-slate-100" style={pageStyle}>
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
                onClick={() => editor && console.log(editor.getHTML())}
                className="flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"           >
                <img
                  src={save}
                  alt="save"
                  className="w-5 h-5"
                />
              </button>
            </div>

            {/* Avatar */}
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border-2 border-white shadow-sm"
              style={avatarStyle}
            ></div>
          </div>
        </header>

        {/* Editor principal */}
        <div className="w-full max-w-4xl rounded-xl bg-white p-8 shadow-2xl flex flex-col min-h-[60vh]">

          {/* Barra de ferramentas */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-2 bg-slate-50 rounded-t-lg -mx-8 -mt-8 mb-4">
            <div className="flex items-center gap-1">
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
          </div>

          {/* Label para o título, um pouco acima do campo */}
          <label
            htmlFor="doc-title"
            className="mb-1 text-lg font-semibold text-gray-700 select-none"
          >
            Título do Documento
          </label>
          {/* Caixa de texto para o título */}
          <input
            id="doc-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite o título do documento"
            className="mb-6 text-3xl font-bold outline-none border-none w-full px-2 py-1 text-gray-800 placeholder-gray-400 bg-transparent"
          />

          {/* Editor de texto */}
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
