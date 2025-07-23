import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { useParams } from 'react-router-dom'
import StarterKit from '@tiptap/starter-kit'
import Underline from './Underline'
import PaginationExtension, { PageNode, HeaderFooterNode, BodyNode } from "tiptap-extension-pagination";
import logo from '../assets/logo1.png'
import save from '../assets/save.png'
import undo from '../assets/undo.png'
import redo from '../assets/redo.png'

const pageStyle = { fontFamily: 'Manrope, "Noto Sans", sans-serif' };
const avatarStyle = {
  backgroundImage:
    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDm3TJQ2bsuTFWymc2Zk_ul_UFNWm9sNykIz-NMHhL0PoS12Fi486mWOZAn3_x22WDH8S0e4rhwVEmLCTpnn9njxyHcw1I_XeGkUReoLJH4uU6tSBqiAHt9mt0NycVBgx6EjInl8KMxpeLk83j0Y_FpT2REm6zfpNrhd_kVJvxKm2NU8HqgCSs0y84v--Shy1_kE_ZEqg1e8a22HZDG4b8vqbjg12BnuFRUk1gaNbl5ySWLhWKtgGNSnf6NVQhfHyjeDroohmI8BH5_")',
};

function Editor({editable = true }) {
  const { id } = useParams()
  const [content, setContent] = useState('')
  
  /* extensões que o Tiptap deve carregar */
  const extensions = [
    StarterKit,
    Underline,
    PaginationExtension.configure({
      pageAmendmentOptions: {
        enableHeader: false,
        enableFooter: false,
      },
      BorderConfig: { top: 0, right: 0, bottom: 0, left: 0 },
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

  useEffect(() => {
    fetch(`http://localhost:8000/api/load/${id}`)
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then((data) => {
        const html = data.content || ''
        setContent(html)
        if (editor) {
          editor.commands.setContent(html)
        }
      })
      .catch(() => {})
  }, [id, editor])

  useEffect(() => {
    if (!id) return
    fetch(`http://localhost:8000/api/save/${id}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
  }, [content, id])
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
        {/* Menu lateral mobile */}
        {/* Editor */}
        <div className="w-full max-w-4xl rounded-xl bg-white p-8 shadow-2xl flex flex-col min-h-[60vh]">
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-2 bg-slate-50 rounded-t-lg -mx-8 -mt-8 mb-4">
            <div className="flex items-center gap-1">
              {[
                { label: 'B', action: 'bold' },
                { label: 'I', action: 'italic' },
                { label: 'U', action: 'underline' },
              ].map(({ label, action }) => (
                <button
                  key={action}
                  onClick={() => editor && editor.chain().focus()[`toggle${action.charAt(0).toUpperCase() + action.slice(1)}`]().run()}
                  className={`p-2 rounded-md ${editor?.isActive(action)
                      ? 'bg-slate-200 text-slate-800'
                      : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                    } transition-colors`}
                >
                  <span className={label.toLowerCase()}>{label}</span>
                </button>
              ))}
              <div className="h-5 w-px bg-slate-300 mx-1"></div>
              <button
                onClick={() => editor && editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded-md ${editor?.isActive('heading', { level: 2 }) ? 'bg-slate-200 text-slate-800' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                  } transition-colors`}
              >
                <span className="font-bold">H2</span>
              </button>
              <button
                onClick={() => editor && editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded-md ${editor?.isActive('bulletList') ? 'bg-slate-200 text-slate-800' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                  } transition-colors`}
              >
                <span>&bull;</span>
              </button>
              <button
                onClick={() => editor && editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded-md ${editor?.isActive('orderedList') ? 'bg-slate-200 text-slate-800' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                  } transition-colors`}
              >
                <span>1.</span>
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="material-icons text-base text-green-500">cloud_done</span>
              <span>Saved</span>
            </div>
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

