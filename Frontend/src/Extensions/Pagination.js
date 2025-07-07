import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'

export const Pagination = Extension.create({
  name: 'pagination',

  addProseMirrorPlugins() {
    const pageHeight = 1122 // roughly 297mm in pixels

    const countBreaks = doc => {
      let count = 0
      doc.descendants(node => {
        if (node.type.name === 'pageBreak') count++
      })
      return count
    }

    return [
      new Plugin({
        key: new PluginKey('pagination'),
        view: view => {
          const check = () => {
            const docHeight = view.dom.scrollHeight
            const expectedBreaks = Math.floor(docHeight / pageHeight)
            const currentBreaks = countBreaks(view.state.doc)
            if (expectedBreaks > currentBreaks) {
              const tr = view.state.tr.insert(view.state.doc.content.size, view.state.schema.nodes.pageBreak.create())
              view.dispatch(tr)
            }
          }

          setTimeout(check, 0)

          return {
            update(view, prevState) {
              if (!view.state.doc.eq(prevState.doc)) {
                setTimeout(check, 0)
              }
            },
          }
        },
      }),
    ]
  },
})
