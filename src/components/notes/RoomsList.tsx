import {
  aliasKeyValidation,
  CollectionKey,
  getUndecoratedRoomAlias,
} from '@eweser/db';
import { CollectionProvider } from '@eweser/hooks';
import { CaretDown, CaretRight, PlusSquare } from '@styled-icons/fa-solid';
import { useSyncedStore } from '@syncedstore/react';

import { useContext, useEffect, useState } from 'react';
import { Dialog } from './Dialog';
import { NotesAppContext } from './NotesAppContext';
import { NotesProvider } from './NotesContext';
import NotesList from './NotesList';
import styles from './RoomsList.module.scss';

const RoomsList = () => {
  const { selectedRoom, db } = useContext(NotesAppContext);

  const registry = db.getRegistryStore();
  const registryStore = useSyncedStore(registry);
  const roomKeys = Object.keys(registryStore?.documents[0]?.notes ?? []);

  const [modalOpen, setOpen] = useState(false);
  const setModalOpen = (open: boolean) => {
    setOpen(open);
    setNewCollectionName('');
  };
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newRoomResult, setNewRoomResult] = useState('');
  const [newRoomLoading, setNewRoomLoading] = useState(false);
  const newRoom = async (name: string) => {
    try {
      setNewRoomLoading(true);
      aliasKeyValidation(name);
      const sanitizedAlias = name
        .trim()
        .toLocaleLowerCase()
        .split('.')
        .join('')
        .split(' ')
        .join('-');

      const result = await db.createAndConnectRoom({
        collectionKey: CollectionKey.notes,
        aliasKey: sanitizedAlias,
        name,
        registryStore,
      });
      if (!result) throw new Error('Failed to create room');
      setModalOpen(false);
    } catch (error: any) {
      setNewRoomResult(error.message);
      setNewRoomLoading(false);
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
              disabled={!newCollectionName || newRoomLoading}
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
        {roomKeys.map((roomKey) => {
          const aliasKey = getUndecoratedRoomAlias(roomKey);
          return (
            <CollectionProvider
              key={roomKey}
              db={db}
              collectionKey={CollectionKey.notes}
              aliasKey={aliasKey}
            >
              <RoomsListItem
                key={roomKey}
                roomAlias={roomKey}
                isSelectedRoom={selectedRoom === roomKey}
              />
            </CollectionProvider>
          );
        })}
      </>
    </div>
  );
};

const RoomsListItemLoading = ({
  show,
  setShow,
}: {
  show: boolean;
  setShow: (show: boolean) => void;
}) => (
  <>
    <div className={styles.titleRow}>
      <span>
        <h3 style={{ display: 'inline' }}>loading...</h3>
        <button style={{ display: 'inline' }} onClick={() => setShow(!show)}>
          {show ? <CaretDown size={16} /> : <CaretRight size={16} />}
        </button>
      </span>
    </div>
    <hr />
  </>
);

const RoomsListItem = ({
  roomAlias,
  isSelectedRoom,
}: {
  roomAlias: string;
  isSelectedRoom: boolean;
}) => {
  const { db } = useContext(NotesAppContext);
  const room = db.collections.notes[roomAlias];
  const userId = db.userId;

  const [roomName, setRoomName] = useState(room?.name ?? '');
  useEffect(() => {
    if (room?.name) {
      setRoomName(room?.name);
    } else {
      let cleanedAlias =
        (userId
          ? room?.roomAlias.split(`~@`)[0].slice(1)
          : room?.roomAlias.slice(1)) ?? '';

      const shortenedAlias =
        cleanedAlias.length > 52
          ? cleanedAlias.slice(0, 52) + '...'
          : cleanedAlias;

      setRoomName(shortenedAlias);
    }
  }, [room?.name, room?.roomAlias, userId]);
  const [show, setShow] = useState(isSelectedRoom);
  if (!room) return <RoomsListItemLoading show={show} setShow={setShow} />;
  else
    return (
      <NotesProvider>
        <div
          className={styles.titleRow}
          // onClick={() =>
          //   setSelectedRoom(getUndecoratedRoomAlias(room.roomAlias))
          // }
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
        {show && <NotesList room={room} />}
      </NotesProvider>
    );
};

export default RoomsList;
