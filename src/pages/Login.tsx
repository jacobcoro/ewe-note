import { useContext, useState } from 'react';
import styles from './index.module.scss';
import { StoreContext } from 'model/storeContext';
import { ConnectStatus } from 'model';
import { DEV_PASSWORD, DEV_USERNAME, MATRIX_SERVER } from 'config';
import { useNavigate } from 'react-router';
import LoginForm from 'components/login/LoginForm';
import { LoginData } from 'model/database';

const Login = () => {
  const navigate = useNavigate();

  const [loginStatus, setLoginStatus] = useState<ConnectStatus>('initial');
  const onSetLoginStatus = (status: ConnectStatus) => {
    setLoginStatus(status);
    if (status === 'ok') navigate('/notes-app');
  };
  const { login } = useContext(StoreContext);
  const initialLoginData: LoginData = {
    baseUrl: MATRIX_SERVER,
    userId: DEV_USERNAME, // these will be empty in prod. This speeds up dev time
    password: DEV_PASSWORD,
  };
  const [loginData, setLoginData] = useState(initialLoginData);
  const handleLogin = () => {
    login(loginData, onSetLoginStatus as any);
  };
  return (
    <div className={styles.root}>
      <h1>Login</h1>
      <LoginForm
        handleLogin={handleLogin}
        loginStatus={loginStatus}
        loginData={loginData}
        setLoginData={setLoginData}
      />
    </div>
  );
};

export default Login;
