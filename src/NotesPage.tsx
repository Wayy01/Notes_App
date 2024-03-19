import { JSONContent } from "@tiptap/react";
import styles from "./NotesPage.module.css";
import { v4 as uuid } from "uuid";
import { useState } from "react";
import debounce from "./debounce";
import NoteEditor from "./NoteEditor";
import storage from "./storage";
import { Note, UserData } from "./types";
import { AES, enc } from "crypto-js";

const STORAGE_KEY = "notes";

const loadNotes = ({ username, passphrase }: UserData) => {
  const noteIds = storage.get<string[]>(`${username}:${STORAGE_KEY}`, []);
  const notes: Record<string, Note> = {};
  noteIds.forEach((id: any) => {
    const encryptedNote = storage.get<string>(
      `${username}:${STORAGE_KEY}:${id}`
    );
    const note: Note = JSON.parse(
      AES.decrypt(encryptedNote, passphrase).toString(enc.Utf8)
    );
    notes[note.id] = {
      ...note,
      updateAt: new Date(note.updateAt),
    };
  });
  return notes;
};

const saveNote = debounce((note: Note, { username, passphrase }: UserData) => {
  const noteIds = storage.get<string[]>(`${username}:${STORAGE_KEY}`, []);
  const noteIdWithoutNote = noteIds.filter((id: string) => id !== note.id);
  storage.set(`${username}:${STORAGE_KEY}`, [...noteIdWithoutNote, note.id]);

  const encryptedNote = AES.encrypt(
    JSON.stringify(note),
    passphrase
  ).toString();
  storage.set(`${username}:${STORAGE_KEY}:${note.id}`, encryptedNote);
}, 200);

type Props = {
  userData: UserData;
};

function App({ userData }: Props) {
  const [notes, setNotes] = useState<Record<string, Note>>(() =>
    loadNotes(userData)
  );
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  const activeNote = activeNoteId ? notes[activeNoteId] : null;

  const handleChangeNoteContent = (
    noteid: string,
    content: JSONContent,
    title = "New note"
  ) => {
    const updatedNotes = {
      ...notes[noteid],
      updateAt: new Date(),
      content,
      title,
    };
    setNotes((notes) => ({
      ...notes,
      [noteid]: updatedNotes,
    }));
    saveNote(updatedNotes, userData);
  };

  const handleCreateNewNote = () => {
    const newNote = {
      id: uuid(),
      title: "New note",
      content: `<h1>New note</h1>`,
      updateAt: new Date(),
    };
    setNotes((notes) => ({ ...notes, [newNote.id]: newNote }));
    setActiveNoteId(newNote.id);
    saveNote(newNote, userData);
  };

  const handleChangeActiveNote = (id: string) => {
    setActiveNoteId(id);
  };

  const notesList = Object.values(notes).sort(
    (a, b) => b.updateAt.getTime() - a.updateAt.getTime()
  );

  return (
    <div className={styles.pageContainer}>
      <div className={styles.sidebar}>
        <button className={styles.sidebarButton} onClick={handleCreateNewNote}>
          New Note
        </button>
        <div className={styles.sidebarLisr}>
          {notesList.map((note) => (
            <div
              key={note.id}
              role="button"
              tabIndex={0}
              className={
                note.id === activeNoteId
                  ? styles.sidebarItemActive
                  : styles.sidebarItem
              }
              onClick={() => handleChangeActiveNote(note.id)}
            >
              {note.title}
            </div>
          ))}
        </div>
      </div>
      {activeNote ? (
        <NoteEditor
          note={activeNote}
          onChange={(content, title) =>
            handleChangeNoteContent(activeNote.id, content, title)
          }
        />
      ) : (
        <div>Create a new note or select an existing note.</div>
      )}
    </div>
  );
}

export default App;
