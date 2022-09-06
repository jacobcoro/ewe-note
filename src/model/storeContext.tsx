import { createContext, FC, PropsWithChildren, useRef, useState } from 'react';

import type { LoginData, ConnectStatus } from './database';
import { Database } from './';

export interface StoreContext {
  login: (
    loginData: LoginData,
    setLoginStatus: (status: ConnectStatus) => void
  ) => void;
  db: Database | null;
  loggedIn: boolean;
  userId: string;
}

const initialStore: StoreContext = {
  login: async () => undefined,
  db: null,
  loggedIn: false,
  userId: '',
};

export const StoreContext = createContext<StoreContext>(initialStore);

export const StoreProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const db = useRef<Database>(new Database());
  const userId = useRef<string>('');
  const login = (
    loginData: LoginData,
    setLoginStatus: (status: ConnectStatus) => void
  ) => {
    console.log({ loginData });
    const setLoginStatusAndCheckLoggedIn = (status: ConnectStatus) => {
      if (status == 'ok') setLoggedIn(true);
      else setLoggedIn(false);
      setLoginStatus(status);
    };

    db.current.onLoginStatusUpdate = setLoginStatusAndCheckLoggedIn;
    db.current.login(loginData);
    userId.current = loginData.userId ?? '';
  };

  // useEffect(() => {
  // initialize localStorage indexedDb sync provider
  // put in useEffect to make sure it only runs client side
  //   new IndexeddbPersistence('my-document-id', doc);
  // }, [login, doc]);
  return (
    <StoreContext.Provider
      value={{ login, db: db.current, loggedIn, userId: userId.current }}
    >
      {children}
    </StoreContext.Provider>
  );
};
