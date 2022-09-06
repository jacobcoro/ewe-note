import type { MatrixClient } from 'matrix-js-sdk';

import { collectionKeys, collections, initialRegistry } from './collections';
import { connectRoom } from './methods/connectRoom';
import { createAndConnectRoom } from './methods/createAndConnectRoom';
import { login } from './methods/login';
import { updateLoginStatus } from './methods/updateLoginStatus';
import { buildRoomAlias } from './utils';

import type {
  ConnectStatus,
  OnLoginStatusUpdate,
  OnRoomConnectStatusUpdate,
  LoginData,
  Room,
  Documents,
  CollectionKey,
} from './types';

import type { Note } from './collections';
import type { Collections } from './types';

export { CollectionKey } from './types'; // enum exported not as a type
export { buildRoomAlias };
export type { Collections, Note, ConnectStatus, LoginData, Room, Documents };

const getCollectionRegistry =
  (_db: Database) => (collectionKey: CollectionKey) =>
    _db.collections.registry['0'].store.documents['0'][collectionKey];

const getRegistryStore = (_db: Database) => () =>
  _db.collections.registry['0'].store;

export class Database {
  matrixClient: MatrixClient | null = null;
  // todo: callbacks on initialization status change.

  loggedIn = false;
  loginStatus: ConnectStatus = 'initial';

  updateLoginStatus = updateLoginStatus(this);
  onLoginStatusUpdate: null | OnLoginStatusUpdate = null;
  onRoomConnectStatusUpdate: null | OnRoomConnectStatusUpdate = null;

  /** homeserver */
  baseUrl: string = 'https://matrix.org';

  collectionKeys = collectionKeys;
  collections: Collections = {
    registry: initialRegistry,
    ...collections,
  };

  connectRoom = connectRoom(this);
  createAndConnectRoom = createAndConnectRoom(this);
  login = login(this);

  getCollectionRegistry = getCollectionRegistry(this);
  getRegistryStore = getRegistryStore(this);
  constructor() {
    // todo: if registry is in localStorage, load up each room's store.
  }
}
