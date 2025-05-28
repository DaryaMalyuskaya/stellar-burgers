import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  ordersSelectors,
  useDispatch,
  useSelector
} from '../../services/store';
import { loadFeed } from '../../services/store/orders';
import { loadIngredients } from '../../services/store/constructor';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFeed());
    dispatch(loadIngredients());
  }, []);

  const feed = useSelector(ordersSelectors.selectFeed);
  const request = useSelector(ordersSelectors.selectFeedRequest);

  if (request || !feed) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={feed.orders}
      handleGetFeeds={() => {
        dispatch(loadFeed());
      }}
    />
  );
};
