import { useEditor, EditorContent, Editor as TpEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

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
      StarterKit.configure({
        hardBreak: false,
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
    <div className="break-words overflow-y-auto w-full  ">
      <EditorContent editor={editor} />
    </div>
  )
}
