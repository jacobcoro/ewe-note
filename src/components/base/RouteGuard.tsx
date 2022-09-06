import { ConnectStatus } from 'model';
import { StoreContext } from 'model/storeContext';
import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const RouteGuard: FC<any> = ({ children }) => {
  const navigate = useNavigate();
  const { loggedIn, login } = useContext(StoreContext);
  const [loginStatus, setLoginStatus] = useState<ConnectStatus>('initial');
  const onSetLoginStatus = useCallback((status: ConnectStatus) => {
    setLoginStatus(status);
  }, []);

  useEffect(() => {
    const checkForLogin = async () => {
      // if not logged in, but has localStorage, try to login.
      const previousLoginData = localStorage.getItem('loginData');
      if (previousLoginData) {
        const loginData = JSON.parse(previousLoginData);
        login(loginData, onSetLoginStatus);
      } else {
        // if not logged in, and no localStorage, redirect to login page.
        navigate('/login');
      }
    };
    if (loginStatus === 'initial') checkForLogin();
  }, [login, loginStatus, navigate, onSetLoginStatus]);

  if (loginStatus === 'failed') {
    navigate('/login');
    return null;
  }

  if (loggedIn || loginStatus === 'ok') return <>{children}</>;
  else return <div>...authenticating</div>;
};
export default RouteGuard;
