import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Editor() {
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
  });

  return (
    <div className="break-words overflow-y-auto w-full  ">
      <EditorContent editor={editor} />
    </div>
  );
}
