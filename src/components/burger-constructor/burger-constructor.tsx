import { FC, useMemo } from 'react';
import {
  TConstructorIngredient,
  TConstructorSelection,
  TConstructorState
} from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  constructorSelectors,
  ordersSelectors,
  useDispatch,
  useSelector
} from '../../services/store';
import { order, ordersSlice } from '../../services/store/orders';
import { constructorSlice } from '../../services/store/constructor';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(constructorSelectors.selectSelection);
  const orderModalData = useSelector(ordersSelectors.selectNewOrder);
  const orderRequest = useSelector(ordersSelectors.selectOrderRequest);
  const dispatch = useDispatch();

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    dispatch(
      order([
        constructorItems.bun._id,
        ...constructorItems.ingredients.map((it) => it._id)
      ])
    );
  };
  const closeOrderModal = () => {
    dispatch(ordersSlice.actions.clearNewOrder());
    dispatch(constructorSlice.actions.clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
