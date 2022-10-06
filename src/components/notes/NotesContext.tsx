import type { Documents, Note } from '@eweser/db';

import { createContext, FC, useCallback, useContext } from 'react';
import { CollectionContext } from '@eweser/hooks';

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

export const NotesContext = createContext(initialContext);

export const NotesProvider: FC<{
  children: any;
}> = ({ children }) => {
  const { store, newDocument } = useContext(CollectionContext);

  const notes: Documents<Note> = store.documents;
  const deleteNote = useCallback(
    (docId: string) => {
      // You can also simply do
      // delete notes[docId];

      // But this will delete the document from the database after 30 days
      const oneMonth = 1000 * 60 * 60 * 24 * 30;
      notes[docId]._deleted = true;
      notes[docId]._ttl = new Date().getTime() + oneMonth;
    },
    [notes]
  );
  // trigger re-render
  // const [lastUpdated, setLastUpdated] = useState(new Date());

  // let mostRecentNote = '0';
  // const findMostRecentNote = useCallback(() => {
  //   let lastEdited = 0;

  //   Object.keys(notes).forEach((noteId) => {
  //     if (notes[noteId]._updated > lastEdited) {
  //       lastEdited = notes[noteId]._updated;
  //       mostRecentNote = noteId;
  //     }
  //   });
  //   return mostRecentNote;
  // }, [notes]);

  // if (Object.values(nonDeletedNotes).length > 0) {
  //   mostRecentNote = findMostRecentNote();
  // } else {
  //   notes[mostRecentNote] = newDocument<NoteBase>(
  //     { text: initialMarkdown },
  //     mostRecentNote
  //   );
  // }

  const createNote = (text: string, id?: string) => {
    console.log('createNote', text, id);
    const newNote = newDocument({ text }, id);
    notes[newNote._id] = newNote;
  };

  const updateNote = useCallback(
    (text: string, noteId: string) => {
      // setLastUpdated(new Date());
      console.log('updateNote', text, noteId);
      console.log('note', JSON.parse(JSON.stringify(notes[noteId])));
      if (!notes[noteId] || notes[noteId]._deleted) return;
      notes[noteId].text = text;
      notes[noteId]._updated = new Date().getTime();
    },
    [notes]
  );

  return (
    <NotesContext.Provider
      value={{
        notes,
        // mostRecentNote,
        deleteNote,
        createNote,
        updateNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};
