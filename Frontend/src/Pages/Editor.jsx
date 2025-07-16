import { useEditor, EditorContent } from '@tiptap/react'
import PropTypes from 'prop-types';
import StarterKit from '@tiptap/starter-kit'
import Underline from './Underline'
import PaginationExtension, { PageNode, HeaderFooterNode, BodyNode } from "tiptap-extension-pagination";

const pageStyle = { fontFamily: 'Manrope, "Noto Sans", sans-serif' };
const avatarStyle = {
  backgroundImage:
    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDm3TJQ2bsuTFWymc2Zk_ul_UFNWm9sNykIz-NMHhL0PoS12Fi486mWOZAn3_x22WDH8S0e4rhwVEmLCTpnn9njxyHcw1I_XeGkUReoLJH4uU6tSBqiAHt9mt0NycVBgx6EjInl8KMxpeLk83j0Y_FpT2REm6zfpNrhd_kVJvxKm2NU8HqgCSs0y84v--Shy1_kE_ZEqg1e8a22HZDG4b8vqbjg12BnuFRUk1gaNbl5ySWLhWKtgGNSnf6NVQhfHyjeDroohmI8BH5_")',
};

function Editor({ content, setContent, editable = true }) {
  /* extensões que o Tiptap deve carregar */
  const extensions = [
    StarterKit,
    Underline,
    PaginationExtension.configure({
      pageAmendmentOptions: {
        enableHeader: false,
        enableFooter: false,
    },
    BorderConfig:{ top: 0, right: 0, bottom: 0, left: 0 },
    }),
    PageNode,
    HeaderFooterNode,
    BodyNode,
  ];
    extensions,
    content,
    editable,
    onUpdate({ editor }) {
      setContent(editor.getHTML());          // devolve o HTML atualizado
    },
    onSelectionUpdate({ editor }) {
      const { $from, $to } = editor.state.selection;
      console.log('Selection updated:', $from.pos, $to.pos);
    },
  });
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-gradient-to-b from-[#625DF5] to-transparent group/design-root overflow-x-hidden"
      style={pageStyle}
    >
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 bg-transparent px-6 py-3 shadow-sm">
          <div className="flex items-center gap-3 text-white">
            <div className="size-6 text-white">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h1 className="text-white text-xl font-bold leading-tight tracking-tight">
              CodeCollab
            </h1>
          </div>
          <div className="flex flex-1 items-center justify-end gap-6">
            <nav className="flex items-center gap-6 text-sm font-medium text-white">
              <a
                className="hover:text-[#82F0FA] white"
                href="#"
              >
                File
              </a>
              <a
                className="hover:text-[#82F0FA] white"
                href="#"
              >
                Edit
              </a>
              <a
                className="hover:text-[#82F0FA] white"
                href="#"
              >
                View
              </a>
              <a
                className="hover:text-[#82F0FA] white"
                href="#"
              >
                Insert
              </a>
              <a
                className="hover:text-[#82F0FA] white"
                href="#"
              >
                Format
              </a>
              <a
                className="hover:text-[#000000] white"
                href="#"
              >
                Tools
              </a>
            </nav>
            <div className="flex items-center gap-2">
              <button
                onClick={() => editor && editor.commands.undo()}
                className="flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
              >
                <span className="material-icons text-xl">undo</span>
              </button>
              <button
                onClick={() => editor && editor.commands.redo()}
                className="flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
              >
                <span className="material-icons text-xl">redo</span>
              </button>
              <button
                onClick={() => editor && console.log(editor.getHTML())}
                className="flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
              >
                <span className="material-icons text-xl">save</span>
              </button>
            </div>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border-2 border-white shadow-sm"
              style={avatarStyle}
            ></div>
          </div>
        </header>


        <main className="flex flex-1 p-0">
          <div className="w-full">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
              <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-2 bg-slate-50">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => editor && editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded-md ${editor?.isActive('bold') ? 'bg-slate-200 text-slate-800' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'} transition-colors`}
                  >
                    <span className="font-bold">B</span>
                  </button>
                  <button
                    onClick={() => editor && editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded-md ${editor?.isActive('italic') ? 'bg-slate-200 text-slate-800' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'} transition-colors`}
                  >
                    <span className="italic">I</span>
                  </button>
                  <button
                    onClick={() => editor && editor.chain().focus().toggleUnderline().run()}
                    className={`p-2 rounded-md ${editor?.isActive('underline') ? 'bg-slate-200 text-slate-800' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'} transition-colors`}
                  >
                    <span className="underline">U</span>
                  </button>
                  <div className="h-5 w-px bg-slate-300 mx-1"></div>
                  <button
                    onClick={() => editor && editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded-md ${editor?.isActive('heading', { level: 2 }) ? 'bg-slate-200 text-slate-800' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'} transition-colors`}
                  >
                    <span className="font-bold">H2</span>
                  </button>
                  <button
                    onClick={() => editor && editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded-md ${editor?.isActive('bulletList') ? 'bg-slate-200 text-slate-800' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'} transition-colors`}
                  >
                    <span>&bull;</span>
                  </button>
                  <button
                    onClick={() => editor && editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded-md ${editor?.isActive('orderedList') ? 'bg-slate-200 text-slate-800' : 'text-slate-600 hover:bg-slate-200 hover:text-slate-800'} transition-colors`}
                  >
                    <span>1.</span>
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="material-icons text-base text-green-500">
                    cloud_done
                  </span>
                  <span>Saved</span>
                </div>
              </div>
              <EditorContent editor={editor} className="w-full h-full outline-none text-black"/>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
Editor.propTypes = {
  content: PropTypes.string.isRequired,
  setContent: PropTypes.func.isRequired,
  editable: PropTypes.bool,
};
export default Editor;
