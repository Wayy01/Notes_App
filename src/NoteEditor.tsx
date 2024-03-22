import {
  EditorContent,
  useEditor,
  JSONContent,
  generateText,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import styles from "./NoteEditor.module.css";
import { Note } from "./types";
import { Underline } from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";

const extensions = [StarterKit];
type Props = {
  note: Note;
  onChange: (content: JSONContent, title?: string) => void;
};

function NoteEditor({ note, onChange }: Props) {
  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Underline,
        Heading,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
      ],
      content: note.content,
      editorProps: {
        attributes: {
          class: styles.textEditor,
        },
      },

      onUpdate: ({ editor }) => {
        const editorContent = editor.getJSON();
        const firstNodeContent = editorContent.content?.[0];
        onChange(
          editorContent,
          firstNodeContent && generateText(firstNodeContent, extensions)
        );
      },
    },
    [note.id]
  );

  const toggleBold = () => {
    editor?.chain().focus().toggleBold().run();
  };
  const toggleItalic = () => {
    editor?.chain().focus().toggleItalic().run();
  };

  const toggleUnderline = () => {
    editor?.chain().toggleUnderline().run();
  };
  const toggleList = () => {
    editor?.chain().toggleBulletList().run();
  };
  const toggleHeading = () => {
    editor?.chain().toggleHeading({ level: 1 }).run();
  };
  const toggleHeadingLevel2 = () => {
    editor?.chain().toggleHeading({ level: 2 }).run();
  };
  const toggleHeadingLevel3 = () => {
    editor?.chain().toggleHeading({ level: 3 }).run();
  };
  const alignLeft = () => {
    editor?.chain().focus().setTextAlign("left").run();
  };
  const alignCenter = () => {
    editor?.chain().focus().setTextAlign("center").run();
  };
  const alignRight = () => {
    editor?.chain().focus().setTextAlign("right").run();
  };
  const toggleListt = () => {
    editor?.chain().focus().toggleOrderedList().run();
  };
  const toggleBulletList = () => {
    editor?.chain().focus().toggleBulletList().run();
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.toolbar}>
        <button
          className={
            editor?.isActive("heading", { level: 1 })
              ? styles.toolbarButtonActive
              : styles.toolbarButton
          }
          onClick={toggleHeading}
        >
          Heading 1
        </button>
        <button
          className={
            editor?.isActive("heading", { level: 2 })
              ? styles.toolbarButtonActive
              : styles.toolbarButton
          }
          onClick={toggleHeadingLevel2}
        >
          Heading 2
        </button>
        <button
          className={
            editor?.isActive("heading", { level: 3 })
              ? styles.toolbarButtonActive
              : styles.toolbarButton
          }
          onClick={toggleHeadingLevel3}
        >
          Heading 3
        </button>

        <button
          className={
            editor?.isActive("bold")
              ? styles.toolbarButtonActive
              : styles.toolbarButton
          }
          onClick={toggleBold}
        >
          Bold
        </button>
        <button
          className={
            editor?.isActive("italic")
              ? styles.toolbarButtonActive
              : styles.toolbarButton
          }
          onClick={toggleItalic}
        >
          Italic
        </button>
        <button
          className={
            editor?.isActive("underline")
              ? styles.toolbarButtonActive
              : styles.toolbarButton
          }
          onClick={toggleUnderline}
        >
          Underline
        </button>

        <button
          className={
            editor?.isActive("align", { algin: "left" })
              ? styles.toolbarButtonActive
              : styles.toolbarButton
          }
          onClick={alignLeft}
        >
          Align Left
        </button>
        <button
          className={
            editor?.isActive("center")
              ? styles.toolbarButtonActive
              : styles.toolbarButton
          }
          onClick={alignCenter}
        >
          Align Center
        </button>
        <button
          className={
            editor?.isActive("text-align", { align: "right" })
              ? styles.toolbarButtonActive
              : styles.toolbarButton
          }
          onClick={alignRight}
        >
          Align Right
        </button>
        <button
          className={
            editor?.isActive("list")
              ? styles.toolbarButtonActive
              : styles.toolbarButton
          }
          onClick={toggleListt}
        >
          Ordered List
        </button>
        <button
          className={
            editor?.isActive("bullet-list")
              ? styles.toolbarButtonActive
              : styles.toolbarButton
          }
          onClick={toggleBulletList}
        >
          Bullet List
        </button>
      </div>
      <EditorContent editor={editor} className={styles.textEditorContent} />
    </div>
  );
}
export default NoteEditor;
