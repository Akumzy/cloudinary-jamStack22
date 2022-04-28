import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface Props {
  setEditorContent: (content: string) => void;
}
export default function Editor({ setEditorContent }: Props) {
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
      setEditorContent(editor.getText());
    },
  });

  return (
    <div className="break-words overflow-y-auto w-full  ">
      <EditorContent editor={editor} />
    </div>
  );
}
