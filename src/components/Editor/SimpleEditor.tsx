import { NotesContext } from 'components/notes/NotesContext';
import { useCallback, useContext } from 'react';
const style = {
  width: '100%',
  minHeight: '300px',
  color: 'var(--text)',
  backgroundColor: 'var(--bg)',
};
/** Can use this when troubleshooting to see if the issue has to do with the markdown editor or something else */
const SimpleEditor: React.FC<{
  readOnly?: boolean;
  noteId: string;
}> = ({ readOnly, noteId }) => {
  const { notes, updateNote } = useContext(NotesContext);
  const handleUpdate = useCallback(
    (text: string) => {
      updateNote(text, noteId);
    },
    [noteId, updateNote]
  );
  if (!notes) return <div>Loading note...</div>;

  const text =
    notes[noteId] && !notes[noteId]._deleted ? notes[noteId].text : '';
  if (readOnly) return <div style={{ padding: '36px' }}>{text}</div>;

  return (
    <textarea
      name="main-card-editor"
      style={style}
      value={notes[noteId] && !notes[noteId]._deleted ? notes[noteId].text : ''}
      onChange={(e) => handleUpdate(e.target.value)}
    ></textarea>
  );
};
export default SimpleEditor;
