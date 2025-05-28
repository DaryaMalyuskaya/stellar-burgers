import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { userSelectors, useSelector } from '../../services/store';

export const AppHeader: FC = () => {
  const user = useSelector(userSelectors.selectUserData);
  return <AppHeaderUI userName={user?.name} />;
};
