import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, userSelectors, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { registerUser } from '../../services/store/user';
import { extractError } from '../../utils/errors';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loading = useSelector(userSelectors.selectRegisterRequest);
  const error = useSelector(userSelectors.selectRegisterError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(
      registerUser({
        email,
        password,
        name: userName
      })
    );
  };

  return loading ? (
    <Preloader />
  ) : (
    <RegisterUI
      errorText={extractError(error)}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
