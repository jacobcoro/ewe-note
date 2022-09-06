import { StoreContext } from 'model/storeContext';
import { useContext, useEffect, useState } from 'react';
import style from './Footer.module.scss';

const Footer = () => {
  const { loggedIn, db } = useContext(StoreContext);
  const [userId, setUserId] = useState('');
  useEffect(() => {
    const getMe = async () => {
      const res = await db?.matrixClient?.whoami();
      if (res) setUserId(res.user_id);
    };
    getMe();
  }, [loggedIn, db, db?.matrixClient]);
  return (
    <footer className={style.root}>
      {userId ? <p>{`signed in as: ${userId}`}</p> : <p>Not signed in</p>}
    </footer>
  );
};

export default Footer;
