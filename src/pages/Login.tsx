import { useContext, useEffect } from 'react';
import styles from './index.module.scss';

import { useNavigate } from 'react-router';
import LoginForm from 'components/login/LoginForm';
import { DatabaseContext } from '@eweser/hooks';

const Login = () => {
  const navigate = useNavigate();

  const { loginStatus, login } = useContext(DatabaseContext);
  useEffect(() => {
    if (loginStatus === 'ok') navigate('/notes-app');
  }, [loginStatus, navigate]);

  return (
    <div className={styles.root}>
      <h1>Login</h1>
      <LoginForm handleLogin={login} loginStatus={loginStatus} />
    </div>
  );
};

export default Login;
