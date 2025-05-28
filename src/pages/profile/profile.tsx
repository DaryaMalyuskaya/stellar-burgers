import { ProfileUI } from '@ui-pages';
import React, { FC, SyntheticEvent, useEffect, useMemo, useState } from 'react';
import { useDispatch, userSelectors, useSelector } from '../../services/store';
import { updateUser } from '../../services/store/user';
import { Preloader } from '@ui';
import { extractError } from '../../utils/errors';

export const Profile: FC = () => {
  const user = useSelector(userSelectors.selectUserData)!;
  const request = useSelector(userSelectors.selectUpdateUserRequest);
  const error = useSelector(userSelectors.selectUpdateUserError);
  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged = useMemo(
    () =>
      formValue.name !== user?.name ||
      formValue.email !== user?.email ||
      !!formValue.password,
    [formValue, user]
  );

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(updateUser(formValue));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return request ? (
    <Preloader />
  ) : (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={extractError(error)}
    />
  );
};
