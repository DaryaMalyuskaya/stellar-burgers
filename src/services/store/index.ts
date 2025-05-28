import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { userReducer, userSlice } from './user';
import { constructorReducer, constructorSlice } from './constructor';
import { ordersReducer, ordersSlice } from './orders';

export const rootReducer = combineReducers({
  userSlice: userReducer,
  constructorSlice: constructorReducer,
  ordersSlice: ordersReducer
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export const userSelectors = userSlice.getSelectors(
  (state: RootState) => state.userSlice
);
export const constructorSelectors = constructorSlice.getSelectors(
  (state: RootState) => state.constructorSlice
);
export const ordersSelectors = ordersSlice.getSelectors(
  (state: RootState) => state.ordersSlice
);

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;
