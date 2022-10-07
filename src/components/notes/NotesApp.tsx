import { buildRoomAlias, CollectionKey } from '@eweser/db';
import { CollectionProvider, DatabaseContext } from '@eweser/hooks';
import useQuery from 'components/base/useMediaQuery';

import Editor from 'components/Editor';

import { useContext, useState } from 'react';
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
  const isMobile = useQuery('(min-width: 768px)');
  const name =
    selectedRoom === defaultNotesRoomAliasKey
      ? 'Default Notes Collection'
      : undefined;

  const [drag, setDrag] = useState({ iniMouse: 0, iniSize: 0 });

  const handleStart = (e: React.DragEvent<HTMLDivElement>) => {
    const editor = document.getElementById(`editor-section`);
    if (!editor) return;
    let iniMouse = isMobile ? e.clientY : e.clientX;
    let iniSize = isMobile ? e.clientY - 8 * 6.5 : editor.offsetWidth;
    setDrag({
      iniMouse: iniMouse,
      iniSize: iniSize,
    });
  };

  const handleMove = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.clientX) {
      const editor = document.getElementById(`editor-section`);
      if (!editor) return;
      let iniMouse = drag.iniMouse;
      let iniSize = drag.iniSize;
      let endMouse = isMobile ? e.clientY : e.clientX;

      if (isMobile) {
        let endSize = iniSize + (endMouse - iniMouse);
        editor.style.minHeight = `${endSize}px`;
        editor.style.width = '100%';
      } else {
        let endSize = iniSize - (endMouse - iniMouse);
        editor.style.width = `${endSize}px`;
        editor.style.height = '100%';
      }
    }
  };
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
