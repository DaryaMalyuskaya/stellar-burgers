import { TConstructorSelection, TConstructorState, TOrder } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: TConstructorSelection;
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
