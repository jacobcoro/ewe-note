import { syncedStore, getYjsValue } from '@syncedstore/core';
import * as Y from 'yjs';

import { newEmptyRoom, newMatrixProvider } from '../utils';
import { initialRegistryStore } from '../collections';
import { CollectionKey } from '../types';
import type { IDatabase, Documents, RegistryData } from '../types';

/** make sure to query the current collection to make sure the passed room's id and alias are correct.  */
export function connectRoom<T>(
  this: IDatabase,
  /** full alias including host name :matrix.org */
  roomAlias: string,
  collectionKey: CollectionKey,
  registryStore?: {
    documents: Documents<RegistryData>;
  }
) {
  return new Promise<boolean>((resolve, reject) => {
    try {
      const registryConnect = collectionKey === CollectionKey.registry;
      /** the internal room alias of the registry is always 0, so that you don't need to always `buildRoomAlias` to find it */
      const dbAlias = registryConnect ? 0 : roomAlias;

      if (!this.collections[collectionKey][dbAlias]) {
        //@ts-ignore
        this.collections[collectionKey][dbAlias] = newEmptyRoom<T>(
          collectionKey,
          roomAlias
        );
      }
      const room = this.collections[collectionKey][dbAlias];
      if (!room) {
        throw new Error('room not found');
      }

      room.connectStatus = 'loading';
      if (!this.matrixClient) {
        throw new Error("can't connect without matrixClient");
      }
      const store = syncedStore({ documents: {} });
      const doc = getYjsValue(store) as Y.Doc;
      // todo: do we also need to register the localStorage provider here too?
      room.matrixProvider = newMatrixProvider({
        doc,
        matrixClient: this.matrixClient,
        roomAlias,
      });

      room.matrixProvider.onReceivedEvents((events) => {
        console.log('onReceivedEvents', events);
      });
      room.matrixProvider.onCanWriteChanged((canWrite) => {
        console.log('canWrite', canWrite);
        resolve(true);
      });
      // connect or fail callbacks:
      room.matrixProvider.matrixReader?.onEvents((e) => {
        console.log('onEvents', e);
      });
      room.matrixProvider.onDocumentAvailable((e) => {
        console.log('onDocumentAvailable', e);
        room.doc = doc;
        room.store = store;

        // populate registry if it is empty
        if (!registryConnect && registryStore && !registryStore?.documents[0]) {
          registryStore.documents[0] = initialRegistryStore.documents[0];
        }

        if (
          !registryConnect &&
          registryStore &&
          !registryStore?.documents[0].notes[roomAlias]
        ) {
          // register room in registry
          // could consider moving this to createRoom, problem is createRoom doesn't have access to the registryStore
          console.log('registering room in registry', roomAlias);
          registryStore.documents[0][room.collectionKey][roomAlias] = {
            roomAlias,
          };

          // TODO: set these in registry.
          const setRoomNameAndId = async () => {
            const roomId = await this.matrixClient?.getRoomIdForAlias(
              room.roomAlias
            );
            if (roomId?.room_id && this.matrixClient) {
              const roomRes = await this.matrixClient?.getRoomSummary(
                roomId?.room_id
              );
              console.log({ roomRes });

              if (roomRes && roomRes.name) {
                const roomName = roomRes.name;
                if (roomName) {
                  room.name = roomName;
                }
              } else {
                const room2Res = await this.matrixClient?.getRooms();
                console.log({ room2Res });
              }
            }
          };
          setRoomNameAndId();
        }

        if (this.onRoomConnectStatusUpdate)
          this.onRoomConnectStatusUpdate('ok', room.collectionKey, roomAlias);
        room.connectStatus = 'ok';

        resolve(true);
      });

      room.matrixProvider.onDocumentUnavailable((e) => {
        console.log('onDocumentUnavailable', e);
        if (this.onRoomConnectStatusUpdate)
          this.onRoomConnectStatusUpdate(
            'failed',
            room.collectionKey,
            roomAlias
          );
        room.connectStatus = 'failed';
        reject('onDocumentUnavailable');
      });

      room.matrixProvider.initialize().then((result) => {
        console.log('initialize result', result);
      });
    } catch (error) {
      console.log('connectRoom error', error);
      console.error(error);
      const room = this.collections[collectionKey][roomAlias];
      if (room && this.onRoomConnectStatusUpdate)
        this.onRoomConnectStatusUpdate(
          'failed',
          room.collectionKey,
          room.roomAlias
        );
      if (room)
        this.collections[room.collectionKey][room.roomAlias].connectStatus =
          'failed';
      reject(error);
    }
  });
}
