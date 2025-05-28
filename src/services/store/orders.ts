import { TFeed, TOrdersState } from '@utils-types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '@api';

const initialState: TOrdersState = {
  orderError: null,
  orderRequest: false,
  newOrder: null,

  history: [],
  historyRequest: false,

  feed: null,
  feedRequest: false,
  feedError: null,

  selectedOrder: null,
  selectedOrderError: null,
  selectedOrderId: null,
  selectedOrderRequest: false
};

export const order = createAsyncThunk(
  'orders/order',
  async (params: string[], { rejectWithValue }) => {
    const data = await orderBurgerApi(params);
    if (!data.success) {
      return rejectWithValue(data);
    }
    return data.order;
  }
);

export const loadUserHistory = createAsyncThunk(
  'orders/loadUserHistory',
  async () => await getOrdersApi()
);

export const loadFeed = createAsyncThunk(
  'orders/loadFeed',
  async (_, { rejectWithValue }) => {
    const data = await getFeedsApi();
    if (!data.success) {
      return rejectWithValue(data);
    }
    return {
      orders: data.orders,
      total: data.total,
      totalToday: data.totalToday
    } as TFeed;
  }
);

export const loadOrder = createAsyncThunk(
  'orders/loadOrder',
  async (id: number, { rejectWithValue, dispatch }) => {
    dispatch(ordersSlice.actions.setSelectedOrderId(id));
    const data = await getOrderByNumberApi(id);
    if (!data.success) {
      return rejectWithValue(data);
    }
    return data.orders[0];
  }
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  selectors: {
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderError: (state) => state.orderError,
    selectNewOrder: (state) => state.newOrder,

    selectHistoryRequest: (state) => state.historyRequest,
    selectHistory: (state) => state.history,

    selectSelectedOrder: (state) => state.selectedOrder,
    selectSelectedOrderRequest: (state) => state.selectedOrderRequest,

    selectFeed: (state) => state.feed,
    selectFeedRequest: (state) => state.feedRequest,
    selectFeedError: (state) => state.feedError
  },
  reducers: {
    clearNewOrder(state) {
      state.newOrder = null;
    },
    setSelectedOrderId(state, action: PayloadAction<number | null>) {
      state.selectedOrderId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(order.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(order.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.error;
      })
      .addCase(order.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.newOrder = action.payload;
      })
      .addCase(loadUserHistory.pending, (state) => {
        state.historyRequest = true;
      })
      .addCase(loadUserHistory.fulfilled, (state, action) => {
        state.historyRequest = false;
        state.history = action.payload;
      })
      .addCase(loadOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(loadOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.payload;
      })
      .addCase(loadOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.selectedOrder = action.payload;
      })
      .addCase(loadFeed.pending, (state) => {
        state.feedRequest = true;
        state.feedError = null;
      })
      .addCase(loadFeed.rejected, (state, action) => {
        state.feedRequest = false;
        state.feedError = action.payload;
      })
      .addCase(loadFeed.fulfilled, (state, action) => {
        state.feedRequest = false;
        state.feed = action.payload;
      });
  }
});

export const ordersReducer = ordersSlice.reducer;
