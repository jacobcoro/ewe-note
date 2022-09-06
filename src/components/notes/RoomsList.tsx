import { CaretDown, CaretRight, PlusSquare } from '@styled-icons/fa-solid';
import { useSyncedStore } from '@syncedstore/react';
import type { Database } from 'model';
import { CollectionKey } from 'model';
import { StoreContext } from 'model/storeContext';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Dialog } from './Dialog';
import { NotesAppContext } from './NotesAppContext';
import { NotesProvider } from './NotesContext';
import NotesList from './NotesList';
import styles from './RoomsList.module.scss';

const RoomsList = ({ db }: { db: Database }) => {
  const registry = db.getRegistryStore();
  const registryStore = useSyncedStore(registry);
  const roomKeys = Object.keys(registryStore.documents[0].notes);
  registry.documents[0].notes;

  const { selectedRoom } = useContext(NotesAppContext);
  const [modalOpen, setOpen] = useState(false);
  const setModalOpen = (open: boolean) => {
    setOpen(open);
    setNewCollectionName('');
  };
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newRoomResult, setNewRoomResult] = useState('');
  const newRoom = async (name: string) => {
    const sanitizedAlias = name
      .trim()
      .toLocaleLowerCase()
      .split('.')
      .join('')
      .split(' ')
      .join('-');

    try {
      const result = await db.createAndConnectRoom({
        collectionKey: CollectionKey.notes,
        alias: sanitizedAlias,
        name,
        registryStore,
      });
      if (!result) throw new Error('Failed to create room');
      setNewRoomResult('Room created ' + result);
    } catch (error: any) {
      setNewRoomResult(error.message);
    }
  };
  return (
    <div>
      <Dialog open={modalOpen} setOpen={setModalOpen}>
        <>
          <h1>New Collection</h1>
          <div className={styles.inputRow}>
            <label htmlFor="collection-name-input">name</label>
            <input
              placeholder="collection name"
              id="collection-name-input"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
            />
            <button
              className={styles.newCollectionButton}
              disabled={!newCollectionName}
              onClick={() => {
                newRoom(newCollectionName);
              }}
            >
              <PlusSquare size={24} />
            </button>
            <h3>{newRoomResult}</h3>
          </div>
        </>
      </Dialog>

      <div className={styles.headerRow}>
        <h3>Collections</h3>
        <button onClick={() => setModalOpen(true)}>
          <h5>new </h5>
          <PlusSquare size={18} />
        </button>
      </div>

      <>
        {roomKeys.map((roomKey) => (
          <RoomsListItem
            key={roomKey}
            roomAlias={roomKey}
            isSelectedRoom={selectedRoom === roomKey}
          />
        ))}
      </>
    </div>
  );
};

const RoomsListItem = ({
  roomAlias,
  isSelectedRoom,
}: {
  roomAlias: string;
  isSelectedRoom: boolean;
}) => {
  const { db, userId } = useContext(StoreContext);
  const { setSelectedRoom } = useContext(NotesAppContext);
  const room = db?.collections.notes[roomAlias];

  const registry = db?.getRegistryStore();
  const registryStore = useSyncedStore(registry);

  const [ready, setReady] = useState(false);

  const connectOrCreateRoom = useCallback(async () => {
    if (room?.connectStatus === 'ok') setReady(true);
    else
      try {
        const res = await db?.connectRoom(
          roomAlias,
          CollectionKey.notes,
          registryStore
        );
        console.log({ res });
        if (res) setReady(true);
      } catch (error) {
        console.log('error connecting to room', error);
      }
  }, [db, roomAlias, registryStore]);
  useEffect(() => {
    if (!ready) connectOrCreateRoom();
  }, [connectOrCreateRoom, ready]);

  const [roomName, setRoomName] = useState(room?.name ?? '');
  useEffect(() => {
    if (room?.name) {
      setRoomName(room?.name);
    } else {
      let cleanedAlias =
        (userId
          ? room?.roomAlias.split(`_${userId}`)[0].slice(1)
          : room?.roomAlias.slice(1)) ?? '';

      const shortenedAlias =
        cleanedAlias.length > 30
          ? cleanedAlias.slice(0, 30) + '...'
          : cleanedAlias;

      setRoomName(shortenedAlias);
    }
  }, [room?.name, room?.roomAlias, userId]);

  const [show, setShow] = useState(isSelectedRoom);
  if (!room || room.connectStatus !== 'ok')
    return (
      <>
        <div className={styles.titleRow}>
          <span>
            <h3 style={{ display: 'inline' }}>loading...</h3>
            <button
              style={{ display: 'inline' }}
              onClick={() => setShow(!show)}
            >
              {show ? <CaretDown size={16} /> : <CaretRight size={16} />}
            </button>
          </span>
        </div>
        <hr />
      </>
    );
  else
    return (
      <NotesProvider notesStore={room.store.documents}>
        <div
          className={styles.titleRow}
          onClick={() => setSelectedRoom(room.roomAlias)}
        >
          <span>
            <h3 style={{ display: 'inline' }}>{roomName}</h3>
            <button
              style={{ display: 'inline' }}
              onClick={() => setShow(!show)}
            >
              {show ? <CaretDown size={16} /> : <CaretRight size={16} />}
            </button>
          </span>
        </div>
        <hr />
        {show && <NotesList />}
      </NotesProvider>
    );
};

export default RoomsList;
