import { CollectionKey, Database } from '@eweser/db';
import { Dispatch, FC, SetStateAction, useState, createContext } from 'react';

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

export const defaultNotesRoomAliasKey = 'notes--default';
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
      console.log('setting selected room', room);
      setSelectedRoomState(room);
    }
  };
  const [selectedNoteId, setSelectedNoteIdState] = useState('');
  const setSelectedNoteId = (noteId: string) => {
    if (noteId !== selectedNoteId) {
      console.log('setting selected NoteId', noteId);
      setSelectedNoteIdState(noteId);
    }
  };
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
