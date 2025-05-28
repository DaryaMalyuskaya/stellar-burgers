import { userSelectors, useSelector } from '../../services/store';
import { Navigate } from 'react-router';
import { Preloader } from '@ui';
import React from 'react';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(userSelectors.selectIsAuthChecked);
  const user = useSelector(userSelectors.selectUserData);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' />;
  }

  if (onlyUnAuth && user) {
    return <Navigate replace to='/' />;
  }

  return children;
};
