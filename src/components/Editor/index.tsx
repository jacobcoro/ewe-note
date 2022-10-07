import React, { useCallback, useContext } from 'react';

import styles from './Editor.module.scss';
import { NotesContext } from 'components/notes/NotesContext';
import Editor from './MilkdownEditor';

export type OnEditorChange = (markdown: string) => void;

const MarkDownEditor: React.FC<{
  readOnly?: boolean;
  noteId: string;
}> = ({ noteId, readOnly }) => {
  const { notes, updateNote } = useContext(NotesContext);

  const handleUpdate = useCallback(
    (text: string) => {
      // gets rid of a bug where empty text prevent the preview from showing. Also starts each blank note with a heading
      updateNote(text === '' ? '#' : text, noteId);
    },
    [noteId, updateNote]
  );
  if (!notes) return <div>Loading note...</div>;

  const text = notes[noteId]?.text ? notes[noteId].text : '#';
  return (
    <div className={styles.root}>
      <Editor onChange={handleUpdate} content={text} readOnly={readOnly} />
    </div>
  );
};

export default MarkDownEditor;
