import { Dispatch, FC, SetStateAction, useState, createContext } from 'react';

type INotesAppContext = {
  selectedRoom: string;
  setSelectedRoom: Dispatch<SetStateAction<string>>;
  selectedNoteId: string;
  setSelectedNoteId: Dispatch<SetStateAction<string>>;
};
const initialContext: INotesAppContext = {
  selectedRoom: '',
  setSelectedRoom: () => {},
  selectedNoteId: '',
  setSelectedNoteId: () => {},
};

export const NotesAppContext = createContext(initialContext);

export const NotesAppProvider: FC<{ children: any }> = ({ children }) => {
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedNoteId, setSelectedNoteId] = useState('');

  return (
    <NotesAppContext.Provider
      value={{
        selectedRoom,
        setSelectedRoom,
        selectedNoteId,
        setSelectedNoteId,
      }}
    >
      {children}
    </NotesAppContext.Provider>
  );
};
