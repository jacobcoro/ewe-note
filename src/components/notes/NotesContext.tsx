import { useSyncedStore } from '@syncedstore/react';
import type { Documents, Note } from 'model';

import { createContext, FC } from 'react';

export const initialMarkdown = `### Write a note`;
export const formatNewNote = (text: string, id: string) => {
  const newNote: Note = {
    _ref: id, // todo: use create ref. ref should be something like 'notes.notes-room-alias-1.1'
    text,
    _id: id,
    _created: new Date().getTime(),
    _updated: new Date().getTime(),
  };
  return newNote;
};

type INotesContext = {
  notes: Documents<Note> | null;
  handleDelete: (note: Note) => void;
  createNote: (noteText: string, noteId: string) => void;
  mostRecentNote: string;
};
const initialContext: INotesContext = {
  notes: null,
  handleDelete: () => {},
  createNote: () => {},
  mostRecentNote: '',
};

export const NotesContext = createContext(initialContext);

export const NotesProvider: FC<{
  children: any;
  notesStore: Documents<Note>;
}> = ({ children, notesStore }) => {
  const notes = useSyncedStore(notesStore);
  const handleDelete = (note: Note) => {
    note._deleted = true;
    note._ttl = new Date().getTime() + 1000 * 60 * 60 * 24 * 30;
  };

  let mostRecentNote = '0';
  const findMostRecentNote = () => {
    let lastEdited = 0;

    Object.keys(notes).forEach((noteId) => {
      if (notes[noteId]._updated > lastEdited) {
        lastEdited = notes[noteId]._updated;
        mostRecentNote = noteId;
      }
    });
    return mostRecentNote;
  };
  const nonDeletedNotes = Object.values(notes).filter(
    (note) => !note._deleted && note.text
  );

  if (nonDeletedNotes.length > 0) {
    mostRecentNote = findMostRecentNote();
  } else {
    notes[mostRecentNote] = formatNewNote(initialMarkdown, mostRecentNote);
  }

  const createNote = (text: string, id: string) => {
    notes[id] = formatNewNote(text, id);
  };

  return (
    <NotesContext.Provider
      value={{
        notes: notes,
        mostRecentNote,
        handleDelete,
        createNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
