import type { ConnectStatus, IDatabase } from '../types';

export const updateLoginStatus =
  (_db: IDatabase) => (status: ConnectStatus) => {
    _db.loginStatus = status;
    if (status === 'ok') _db.loggedIn = true;
    else _db.loggedIn = false;
    if (_db.onLoginStatusUpdate) _db.onLoginStatusUpdate(status);
  };
