import { getUndecoratedRoomAlias, Note, Room } from '@eweser/db';
import { Edit, Trash } from '@styled-icons/fa-solid';
import Editor from 'components/Editor';

import { useContext } from 'react';
import style from './NotesApp.module.scss';
import { NotesAppContext } from './NotesAppContext';
import { initialMarkdown, NotesContext } from './NotesContext';

const NotesList = ({ room }: { room: Room<Note> }) => {
  const { createNote, notes, deleteNote } = useContext(NotesContext);
  const { setSelectedNoteId, setSelectedRoom } = useContext(NotesAppContext);

  if (!notes) return <div></div>;

  const nonDeletedNotes = Object.fromEntries(
    Object.values(notes)
      .filter((note) => !note._deleted && note.text)
      .map((note) => [note._id, note])
  );

  return (
    <>
      <button
        onClick={() => createNote(initialMarkdown)}
        className={style.newNoteButton}
      >
        <Edit size={28} />
      </button>
      {Object.keys(nonDeletedNotes).map((_id) => {
        const note = notes[_id];
        return (
          note.text &&
          !note._deleted && (
            <div
              className={style.note}
              key={note._id}
              onClick={() => {
                setSelectedRoom(getUndecoratedRoomAlias(room.roomAlias));
                setSelectedNoteId(_id);
              }}
            >
              <div className={style.noteButtonRow}>
                <button
                  onClick={() => deleteNote(note._id)}
                  className={style.trashButton}
                >
                  <Trash size={16} />
                </button>
              </div>
              <Editor key={note.text} readOnly noteId={note._id} />{' '}
            </div>
          )
        );
      })}
    </>
  );
};

export default NotesList;
