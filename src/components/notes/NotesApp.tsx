import { CollectionKey, Database } from '@eweser/db';
import { CollectionProvider, DatabaseContext } from '@eweser/hooks';
import { useSyncedStore } from '@syncedstore/react';
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

const NotesAppDashboard = () => {
  const { selectedRoom, selectedNoteId, db } = useContext(NotesAppContext);

  const name =
    selectedRoom === defaultNotesRoomAliasKey
      ? 'Default Notes Collection'
      : undefined;

  return (
    <div className={style.root}>
      <section className={style.editorSection}>
        <CollectionProvider
          db={db}
          collectionKey={CollectionKey.notes}
          aliasKey={selectedRoom}
          name={name}
        >
          <NotesProvider>
            <Editor noteId={selectedNoteId} />
          </NotesProvider>
        </CollectionProvider>
      </section>
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
