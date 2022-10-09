import React, { useCallback, useContext } from 'react';
import { debounce } from 'lodash';
import styles from './Editor.module.scss';
import { NotesContext } from 'components/notes/NotesContext';
import Editor from './MilkdownEditor';
const debounceTime = 2000;
export type OnEditorChange = (markdown: string) => void;

const MarkDownEditor: React.FC<{
  readOnly?: boolean;
  noteId: string;
}> = ({ noteId, readOnly }) => {
  const { notes, updateNote } = useContext(NotesContext);
  // TODO: check if the editor changes when remote changes.

  if (!notes) return <div>Loading note...</div>;

  const [noteText, setNoteText] = React.useState(notes[noteId]?.text ?? '#');

  const debouncedUpdate = React.useRef(
    debounce((text: string) => {
      updateNote(text, noteId);
    }, debounceTime)
  ).current;

  // unregister debouncer if it hasn't been called yet
  React.useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handleUpdate = useCallback(
    (text: string) => {
      setNoteText(text === '' ? '#' : text);

      // gets rid of a bug where empty text prevent the preview from showing. Also starts each blank note with a heading
      debouncedUpdate(text === '' ? '#' : text);
    },
    [updateNote]
  );

  return (
    <div className={styles.root}>
      <Editor onChange={handleUpdate} content={noteText} readOnly={readOnly} />
    </div>
  );
};

export default MarkDownEditor;
