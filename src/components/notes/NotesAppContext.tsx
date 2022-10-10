import {
  buildRoomAlias,
  CollectionKey,
  Database,
  Documents,
  Note,
} from '@eweser/db';
import { FC, useState, createContext, useCallback, useEffect } from 'react';

type INotesAppContext = {
  selectedRoom: string;
  setSelectedRoom: (roomAlias: string) => void;
  selectedNoteId: string;
  setSelectedNoteId: (noteId: string) => void;
  db: Database;
};
const initialContext: INotesAppContext = {
  selectedRoom: '',
  setSelectedRoom: () => {},
  selectedNoteId: '',
  setSelectedNoteId: () => {},
  db: {} as Database,
};

export const defaultNotesRoomAliasKey = 'default-notes-collection';
export const defaultCollectionData = {
  collectionKey: CollectionKey.notes,
  aliasKey: defaultNotesRoomAliasKey,
  name: 'Default Notes Collection',
};

export const NotesAppContext = createContext(initialContext);

export const NotesAppProvider: FC<{ children: any; db: Database }> = ({
  children,
  db,
}) => {
  /** Selected room is truncated (room aliasKey) */
  const [selectedRoom, setSelectedRoomState] = useState<string>(
    defaultNotesRoomAliasKey
  );
  const setSelectedRoom = (room: string) => {
    if (room !== selectedRoom) {
      setSelectedRoomState(room);
    }
  };
  const [selectedNoteId, setSelectedNoteIdState] = useState('0');
  const setSelectedNoteId = (noteId: string) => {
    if (noteId !== selectedNoteId) {
      setSelectedNoteIdState(noteId);
    }
  };
  const noteRoom =
    db.collections.notes[buildRoomAlias(selectedRoom, db.userId)];
  const notes = noteRoom?.store?.documents;

  return (
    <NotesAppContext.Provider
      value={{
        selectedRoom,
        setSelectedRoom,
        selectedNoteId,
        setSelectedNoteId,
        db,
      }}
    >
      {children}
    </NotesAppContext.Provider>
  );
};
