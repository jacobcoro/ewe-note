import type { Documents, Note } from '@eweser/db';

import { createContext, FC, useCallback, useContext, useEffect } from 'react';
import { CollectionContext } from '@eweser/hooks';
import { NotesAppContext } from './NotesAppContext';

export const initialMarkdown = `### Write a note`;

type INotesContext = {
  notes: Documents<Note> | null;
  // mostRecentNote: string;
  createNote: (text: string, noteId?: string) => void;
  updateNote: (text: string, noteId: string) => void;
  deleteNote: (noteId: string) => void;
};
const initialContext: INotesContext = {
  notes: null,
  // mostRecentNote: '',
  createNote: () => {},
  updateNote: () => {},
  deleteNote: () => {},
};
const findMostRecentNote = (notes: Documents<Note>) => {
  let mostRecentNote = '0';

  if (notes) {
    let lastEdited = 0;

    Object.keys(notes).forEach((noteId) => {
      if (!notes[noteId]._deleted && notes[noteId]._updated > lastEdited) {
        lastEdited = notes[noteId]._updated;
        mostRecentNote = noteId;
      }
    });
  }

  return mostRecentNote;
};
export const NotesContext = createContext(initialContext);

export const NotesProvider: FC<{
  children: any;
}> = ({ children }) => {
  const { store, newDocument } = useContext(CollectionContext);
  const { setSelectedNoteId } = useContext(NotesAppContext);

  const notes: Documents<Note> = store.documents;
  const deleteNote = useCallback(
    (docId: string) => {
      const oneMonth = 1000 * 60 * 60 * 24 * 30;
      notes[docId]._deleted = true;
      notes[docId]._ttl = new Date().getTime() + oneMonth;
    },
    [notes]
  );

  const createNote = (text: string, id?: string) => {
    const newNote = newDocument({ text }, id);
    notes[newNote._id] = newNote;
  };

  const updateNote = useCallback(
    (text: string, noteId: string) => {
      if (!notes[noteId] || notes[noteId]._deleted) return;
      if (notes[noteId].text === text) return;
      notes[noteId].text = text;
      notes[noteId]._updated = new Date().getTime();
    },
    [notes]
  );

  useEffect(() => {
    setSelectedNoteId(findMostRecentNote(notes));
  }, []);

  return (
    <NotesContext.Provider
      value={{
        notes,
        deleteNote,
        createNote,
        updateNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
