import { useSyncedStore } from '@syncedstore/react';
import Editor from 'components/Editor';
import type { Database, Note, Room } from 'model';
import { CollectionKey, buildRoomAlias } from 'model';
import { StoreContext } from 'model/storeContext';
import { useCallback, useContext, useEffect, useState } from 'react';
import style from './NotesApp.module.scss';
import { NotesAppContext, NotesAppProvider } from './NotesAppContext';
import { NotesProvider } from './NotesContext';

const defaultNotesRoomAliasKey = 'notes--default';
import RoomsList from './RoomsList';

const NotesAppInternal = ({ db }: { db: Database }) => {
  const { userId } = useContext(StoreContext);
  const { selectedRoom, setSelectedRoom } = useContext(NotesAppContext);

  const room: Room<Note> | null = db.collections.notes[selectedRoom] ?? null;
  const store = room?.store ?? null;

  const [ready, setReady] = useState(!!store?.documents);

  const registry = db.getRegistryStore();
  const registryStore = useSyncedStore(registry);

  const connectOrCreateRoom = useCallback(async () => {
    const defaultNotesRoomAlias = buildRoomAlias(
      defaultNotesRoomAliasKey,
      userId
    );
    if (!selectedRoom) return setSelectedRoom(defaultNotesRoomAlias);
    const notesRegistry = registryStore?.documents[0]?.notes ?? {};
    const registryKeys = Object.keys(notesRegistry);
    // lookup notes rooms in registry
    if (registryKeys.length === 0) {
      console.log('no notes rooms found, creating default room');

      const defaultNotesRoom = await db.createAndConnectRoom({
        collectionKey: CollectionKey.notes,
        alias: defaultNotesRoomAliasKey,
        name: 'Default Notes Collection',
        registryStore,
      });
      if (defaultNotesRoom) setReady(true);
      // todo: handle error
    } else {
      const res = await db.connectRoom(
        selectedRoom,
        CollectionKey.notes,
        registryStore
      );
      if (res) setReady(true);
      // todo: handle error
    }
  }, [db, selectedRoom, userId, setSelectedRoom, registryStore]);

  useEffect(() => {
    if (!ready) connectOrCreateRoom();
  }, [connectOrCreateRoom, ready]);
  if (ready) return <NotesAppDashboard db={db} />;
  return <div>...loading collections</div>;
};

const NotesAppDashboard = ({ db }: { db: Database }) => {
  const { selectedRoom, selectedNoteId } = useContext(NotesAppContext);

  return (
    <div className={style.root}>
      <section className={style.notesListSection}>
        <RoomsList db={db} />
      </section>
      <section className={style.editorSection}>
        {/* editor just has notes provider of selected room */}
        <NotesProvider
          notesStore={db.collections.notes[selectedRoom].store.documents}
        >
          <Editor selectedNoteId={selectedNoteId} />
        </NotesProvider>
      </section>
    </div>
  );
};

const NotesApp = () => {
  const { db } = useContext(StoreContext);
  if (!db || !db.collections.registry[0]?.store)
    return <div>...loading database</div>;

  return (
    <NotesAppProvider>
      <NotesAppInternal db={db}></NotesAppInternal>
    </NotesAppProvider>
  );
};

export default NotesApp;
