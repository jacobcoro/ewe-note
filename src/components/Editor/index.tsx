import React, { useCallback, useContext, useEffect, useState } from 'react';

import styles from './Editor.module.scss';
import { NotesContext } from 'components/notes/NotesContext';
import Editor from './MilkdownEditor';
import { NotesAppContext } from 'components/notes/NotesAppContext';

export type OnEditorChange = (markdown: string) => void;

const MarkDownEditor: React.FC<{
  readOnly?: boolean;
  content?: string;
  selectedNoteId?: string;
}> = (props) => {
  const { notes, mostRecentNote } = useContext(NotesContext);
  const { selectedNoteId } = useContext(NotesAppContext);

  const selectedNote = selectedNoteId ? selectedNoteId : mostRecentNote;

  const [noteText, setNoteText] = useState(
    notes ? notes[selectedNote]?.text : ''
  );

  useEffect(() => {
    setNoteText(notes ? notes[selectedNote]?.text : '');
  }, [selectedNote, notes]);

  const onChange = useCallback(
    (markdown: string) => {
      if (notes && notes[selectedNote]) {
        notes[selectedNote].text = markdown;
        notes[selectedNote]._updated = new Date().getTime();
      }
    },
    [notes, selectedNote]
  );

  return (
    <div className={styles.root}>
      {notes && noteText && (
        <Editor
          onChange={onChange}
          content={props.content ?? noteText}
          readOnly={props.readOnly}
        />
      )}
    </div>
  );
};
export default MarkDownEditor;
