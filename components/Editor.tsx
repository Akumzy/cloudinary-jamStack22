import { useEditor, EditorContent, Editor as TpEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"

interface Props {
  setEditorContent: (content: string) => void
  setTextEditor: (editor: any) => void
}
export default function Editor({ setEditorContent, setTextEditor }: Props) {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: "max-h-[90px] h-full outline-none",
      },
    },
    extensions: [
      // StarterKit.configure({
      //   hardBreak: false,
      // }),
      Placeholder.configure({
        emptyEditorClass: "text-white font-bold text-md",
        placeholder: "Add a comment...",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getText())
    },
    onCreate: ({ editor }) => {
      setTextEditor(editor)
    },
  })

  return (
    <div className="w-full overflow-y-auto break-words ">
      <EditorContent editor={editor} />
    </div>
  )
}
