import { NotesContext } from 'components/notes/NotesContext';
import { useCallback, useContext } from 'react';
const style = {
  width: '100%',
  minHeight: '300px',
  color: 'var(--text)',
  backgroundColor: 'var(--bg)',
};
const SimpleEditor: React.FC<{
  readOnly?: boolean;
  noteId: string;
}> = ({ readOnly, noteId }) => {
  const { notes, updateNote } = useContext(NotesContext);
  const handleUpdate = useCallback(
    (text: string) => {
      console.log('handleUpdate', text);
      updateNote(text, noteId);
    },
    [noteId, updateNote]
  );
  if (!notes) return <div>Loading collection...</div>;
  if (!readOnly) {
    console.log({ noteId });
    if (notes[noteId]) console.log(JSON.parse(JSON.stringify(notes[noteId])));
    else console.log(JSON.parse(JSON.stringify(notes)));
  }
  const text =
    notes[noteId] && !notes[noteId]._deleted ? notes[noteId].text : '';
  if (readOnly) return <div>{text}</div>;

  console.log({ text });

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
