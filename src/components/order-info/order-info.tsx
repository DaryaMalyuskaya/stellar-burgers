import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import {
  constructorSelectors,
  ordersSelectors,
  useDispatch,
  useSelector
} from '../../services/store';
import { useParams } from 'react-router-dom';
import { loadOrder } from '../../services/store/orders';
import { loadIngredients } from '../../services/store/constructor';

export const OrderInfo: FC = () => {
  const { number: id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(loadOrder(Number(id)));
      dispatch(loadIngredients());
    }
  }, [id]);

  const orderData = useSelector(ordersSelectors.selectSelectedOrder);
  const orderRequest = useSelector(ordersSelectors.selectSelectedOrderRequest);
  const ingredients = useSelector(constructorSelectors.selectIngredients);
  const ingredientsRequest = useSelector(
    constructorSelectors.selectIngredientsRequest
  );

  useEffect(() => {
    console.info(orderData, orderRequest);
  }, [orderData, orderRequest]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (orderRequest || ingredientsRequest) return null;
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
