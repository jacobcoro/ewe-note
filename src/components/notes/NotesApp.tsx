import { buildRoomAlias, CollectionKey } from '@eweser/db';
import { CollectionProvider, DatabaseContext } from '@eweser/hooks';
import useEditorDragBar from 'components/base/useEditorDragBar';

import Editor from 'components/Editor';

import { useContext } from 'react';
import style from './NotesApp.module.scss';
import {
  defaultNotesRoomAliasKey,
  NotesAppContext,
  NotesAppProvider,
} from './NotesAppContext';
import { NotesProvider } from './NotesContext';
import RoomsList from './RoomsList';

const MainEditor = ({ selectedRoom }: { selectedRoom: string }) => {
  const { db, selectedNoteId } = useContext(NotesAppContext);
  const room = db.collections.notes[buildRoomAlias(selectedRoom, db.userId)];
  if (!room) return <div>Room not found</div>;
  return (
    <NotesProvider>
      <Editor key={selectedNoteId} noteId={selectedNoteId} />
    </NotesProvider>
  );
};

const NotesAppDashboard = () => {
  const { selectedRoom, db } = useContext(NotesAppContext);

  const { handleMove, handleStart } = useEditorDragBar();

  const name =
    selectedRoom === defaultNotesRoomAliasKey
      ? 'Default Notes Collection'
      : undefined;

  return (
    <div className={style.root}>
      <section className={style.editorSection} id="editor-section">
        <CollectionProvider
          db={db}
          collectionKey={CollectionKey.notes}
          aliasKey={selectedRoom}
          name={name}
        >
          <MainEditor selectedRoom={selectedRoom} />
        </CollectionProvider>
      </section>
      <div
        className={style.dragger}
        draggable={true}
        onMouseDown={(e) => handleStart(e as any)}
        onDrag={(e) => handleMove(e)}
      />
      <section className={style.notesListSection}>
        <RoomsList />
      </section>
    </div>
  );
};

const NotesApp = () => {
  const { db } = useContext(DatabaseContext);
  if (!db) return <div>Loading...</div>;
  else
    return (
      <NotesAppProvider db={db}>
        <NotesAppDashboard />
      </NotesAppProvider>
    );
};

export default NotesApp;
