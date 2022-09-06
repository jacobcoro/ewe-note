import { buildRoomAlias, createRoom, truncateRoomAlias } from '../utils';

import type {
  Documents,
  RegistryData,
  IDatabase,
  CollectionKey,
} from '../types';

/** pass in undecorated alias. if the final will be # `#<alias>_<username>:matrix.org' just pass <alias> */
export const createAndConnectRoom =
  (_db: IDatabase) =>
  async ({
    collectionKey,
    alias,
    name,
    topic,
    registryStore,
  }: {
    collectionKey: CollectionKey;
    /** undecorated alias */
    alias: string;
    name?: string;
    topic?: string;
    registryStore?: {
      documents: Documents<RegistryData>;
    };
  }) => {
    try {
      if (!_db.matrixClient)
        throw new Error("can't create room without matrixClient");
      const userId = _db.matrixClient.getUserId();
      console.log({ userId });
      if (!userId) throw new Error('userId not found');
      const newRoomAlias = buildRoomAlias(alias, userId);
      const newRoomAliasTruncated = truncateRoomAlias(newRoomAlias);
      try {
        const createRoomResult = await createRoom(
          _db.matrixClient,
          newRoomAliasTruncated,
          name,
          topic
        );
        console.log({ createRoomResult });
      } catch (error: any) {
        if (JSON.stringify(error).includes('M_ROOM_IN_USE')) {
          // console.log('room already exists');
          await _db.matrixClient.joinRoom(newRoomAlias);
        } else throw error;
      }

      await _db.connectRoom(newRoomAlias, collectionKey, registryStore);
      return alias;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
