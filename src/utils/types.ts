export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

export type TConstructorIngredient = TIngredient & {
  id: string;
};

export type TOrder = {
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TUser = {
  email: string;
  name: string;
};

export type TTabMode = 'bun' | 'sauce' | 'main';

export type TConstructorSelection = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export type TConstructorState = {
  items: TConstructorSelection;
  ingredients: TIngredient[];
  ingredientsRequest: boolean;
  selectedIngredient: string | null;
};

export type TFeed = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TOrdersState = {
  orderRequest: boolean;
  orderError: null | unknown;
  newOrder: TOrder | null;

  history: TOrder[];
  historyRequest: boolean;

  feed: TFeed | null;
  feedRequest: boolean;
  feedError: null | unknown;

  selectedOrderId: number | null;
  selectedOrder: TOrder | null;
  selectedOrderRequest: boolean;
  selectedOrderError: null | unknown;
};

export type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  data: null | TUser;
  loginUserError: null | unknown;
  loginUserRequest: boolean;
  registerUserError: null | unknown;
  registerUserRequest: boolean;
  updateUserError: null | unknown;
  updateUserRequest: boolean;
};
