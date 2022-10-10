import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { debounce } from 'lodash';
import styles from './Editor.module.scss';
import { NotesContext } from 'components/notes/NotesContext';
import Editor from './MilkdownEditor';
const debounceTime = 2000;
export type OnEditorChange = (markdown: string) => void;

/** make sure to rerender this component if the noteId changes. You can do that by adding `key={noteId}` */
const MarkDownEditor: React.FC<{
  readOnly?: boolean;
  noteId: string;
}> = ({ noteId, readOnly }) => {
  const { notes, updateNote } = useContext(NotesContext);

  if (!notes) return <div>Loading note...</div>;
  const text = notes[noteId]?.text ?? '#';
  const [noteText, setNoteTextState] = useState(text);
  const setNoteText = (text: string) => {
    if (text !== noteText) {
      setNoteTextState(text);
    }
  };
  const [typing, setTyping] = useState(false);

  const debouncedUpdate = useRef(
    debounce((text: string) => {
      updateNote(text, noteId);
      setTyping(false);
    }, debounceTime)
  ).current;

  // unregister debouncer if it hasn't been called yet
  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handleUpdate = useCallback(
    (text: string) => {
      setNoteText(text === '' ? '#' : text);
      setTyping(true);
      // gets rid of a bug where empty text prevent the preview from showing. Also starts each blank note with a heading
      debouncedUpdate(text === '' ? '#' : text);
    },
    [updateNote]
  );

  // listen for changes from remote, but don't update the editor if the user is typing or the changes don't include differences
  useEffect(() => {
    console.log('remote change', typing, text, noteText);
    if (!typing && text !== noteText) {
      setNoteText(text);
    }
  }, [text, typing]);
  console.log('rendering editor', noteId);
  return (
    <div className={styles.root}>
      <Editor onChange={handleUpdate} content={noteText} readOnly={readOnly} />
    </div>
  );
};

export default MarkDownEditor;
