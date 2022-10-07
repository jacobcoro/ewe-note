import { DEV_PASSWORD, DEV_USERNAME, MATRIX_SERVER } from 'config';
import { LoginData, ConnectStatus } from '@eweser/db';
import style from './LoginForm.module.scss';
import { useState } from 'react';

const initialLoginData: LoginData = {
  baseUrl: MATRIX_SERVER,
  userId: DEV_USERNAME, // these will be empty in prod. This speeds up dev time
  password: DEV_PASSWORD,
};
export interface Props {
  handleLogin: (loginData: LoginData) => void;
  loginStatus: ConnectStatus;
}
type FormField = keyof LoginData;

const usernameValidation = (username: string) => {
  if (!username.startsWith('@')) return 'Username must start with @';
  if (!username.includes(':' || !username.split(':')[1].includes('.')))
    return 'Username must include a homeserver, e.g ...:homeserver.org';
  if (username.includes(' ')) return 'Username cannot contain spaces';
  if (username.includes('~')) return 'Username cannot contain ~';
  if (username.length < 3) return 'Username must be at least 3 characters';
  return 'ok';
};

const LoginForm = ({ handleLogin, loginStatus }: Props) => {
  const [loginData, setLoginData] = useState(initialLoginData);
  const [validationError, setValidationError] = useState('');

  const handleChange = (field: FormField, value: string) => {
    setValidationError('');
    if (field === 'userId') {
      const validation = usernameValidation(value);
      if (validation !== 'ok') {
        setValidationError(validation);
      }
    }
    const loginDataChange = {
      ...loginData,
      [field]: value,
    };
    setLoginData(loginDataChange);
  };
  const login = () => handleLogin(loginData);

  return (
    <div className={style.root}>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="server-input">Homeserver:</label>
        <input
          id="server-input"
          value={loginData.baseUrl}
          onChange={(e) => handleChange('baseUrl', e.target.value)}
        />

        <label htmlFor="user-input">Matrix user id: *</label>
        <input
          autoComplete="username"
          placeholder="e.g.: @jacob:matrix.org"
          id="user-input"
          onChange={(e) => handleChange('userId', e.target.value)}
          value={loginData.userId}
        ></input>

        <label htmlFor="password-input">Password:</label>
        <input
          autoComplete="current-password"
          id="password-input"
          type="password"
          onChange={(e) => handleChange('password', e.target.value)}
          value={loginData.password}
        ></input>
        {validationError !== '' && (
          <p className={style.error}>{validationError}</p>
        )}

        {loginStatus === 'failed' && (
          <p className={style.error}>Login failed</p>
        )}

        <button
          disabled={loginStatus === 'loading' || validationError !== ''}
          onClick={login}
        >
          Login
        </button>
        <p>
          {`* Sign up at `}
          <a href="https://app.element.io/">element.io</a> with the username and
          password option
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
