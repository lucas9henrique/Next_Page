import { Mark } from '@tiptap/core'

const Underline = Mark.create({
  name: 'underline',

  parseHTML() {
    return [
      { tag: 'u' },
      { style: 'text-decoration=underline' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['u', HTMLAttributes, 0]
  },

  addCommands() {
    return {
      toggleUnderline: () => ({ commands }) => commands.toggleMark(this.name),
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-u': () => this.editor.commands.toggleUnderline(),
    }
  },
})

export default Underline
