import { DatabaseContext } from '@eweser/hooks';
import { FC, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';

const RouteGuard: FC<any> = ({ children }) => {
  const navigate = useNavigate();
  const { loginStatus, login } = useContext(DatabaseContext);

  useEffect(() => {
    const checkForLogin = async () => {
      // if not logged in, but has localStorage, try to login.
      const previousLoginData = localStorage.getItem('loginData');
      if (previousLoginData) {
        const loginData = JSON.parse(previousLoginData);
        login(loginData);
      } else {
        // if not logged in, and no localStorage, redirect to login page.
        navigate('/login');
      }
    };
    if (loginStatus === 'initial') checkForLogin();
  }, [login, loginStatus, navigate]);

  if (loginStatus === 'failed') {
    navigate('/login');
    return null;
  }

  if (loginStatus === 'ok') return <>{children}</>;
  else return <div>...authenticating</div>;
};
export default RouteGuard;
