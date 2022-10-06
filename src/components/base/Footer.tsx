import { DatabaseContext } from '@eweser/hooks';
import { useContext, useEffect, useState } from 'react';
import style from './Footer.module.scss';

const Footer = () => {
  const { loginStatus, db } = useContext(DatabaseContext);
  const [userId, setUserId] = useState('');
  useEffect(() => {
    const getMe = async () => {
      setUserId(db?.userId ?? '');
    };
    getMe();
  }, [loginStatus, db, db?.matrixClient]);
  return (
    <footer className={style.root}>
      {userId ? <p>{`signed in as: ${userId}`}</p> : <p>Not signed in</p>}
    </footer>
  );
};

export default Footer;
