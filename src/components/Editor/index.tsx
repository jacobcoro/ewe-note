import React, { useCallback, useContext, useEffect, useState } from 'react';

import styles from './Editor.module.scss';
import { NotesContext } from 'components/notes/NotesContext';
import Editor from './MilkdownEditor';
import { NotesAppContext } from 'components/notes/NotesAppContext';
import SimpleEditor from './SimpleEditor';

export type OnEditorChange = (markdown: string) => void;

const MarkDownEditor: React.FC<{
  readOnly?: boolean;
  noteId: string;
}> = ({ noteId, readOnly }) => {
  const { notes, updateNote } = useContext(NotesContext);

  const onChange = (text: string) => {
    updateNote(text, noteId);
  };
  if (!notes) return <div>...</div>;
  return (
    <div className={styles.root}>
      <Editor
        onChange={onChange}
        content={notes[noteId]?.text ?? ''}
        readOnly={readOnly}
      />
    </div>
  );
};

export default SimpleEditor;
