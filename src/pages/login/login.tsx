import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, userSelectors, useSelector } from '../../services/store';
import { loginUser } from '../../services/store/user';
import { Preloader } from '@ui';
import { extractError } from '../../utils/errors';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loading = useSelector(userSelectors.selectLoginRequest);
  const error = useSelector(userSelectors.selectLoginError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      loginUser({
        email,
        password
      })
    );
  };

  return loading ? (
    <Preloader />
  ) : (
    <LoginUI
      errorText={extractError(error)}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
