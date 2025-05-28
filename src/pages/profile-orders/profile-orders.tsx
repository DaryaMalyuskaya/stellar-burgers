import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  ordersSelectors,
  useDispatch,
  useSelector
} from '../../services/store';
import { loadUserHistory } from '../../services/store/orders';
import { Preloader } from '@ui';
import { loadIngredients } from '../../services/store/constructor';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const request = useSelector(ordersSelectors.selectHistoryRequest);
  const history = useSelector(ordersSelectors.selectHistory);

  useEffect(() => {
    dispatch(loadUserHistory());
    dispatch(loadIngredients());
  }, []);

  return request ? <Preloader /> : <ProfileOrdersUI orders={history} />;
};
