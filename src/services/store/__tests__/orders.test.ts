import { loadFeed, ordersReducer, ordersSlice } from '../orders';

describe('ordersSlice', () => {
  it('очищает newOrder', () => {
    const prevState = {
      ...ordersReducer(undefined, { type: '' }),
      newOrder: {
        _id: '',
        status: '',
        name: '',
        createdAt: '',
        updatedAt: '',
        number: 0,
        ingredients: []
      }
    };

    const state = ordersReducer(prevState, ordersSlice.actions.clearNewOrder());
    expect(state.newOrder).toBeNull();
  });

  it('проставляет selectedOrderId', () => {
    const state = ordersReducer(
      undefined,
      ordersSlice.actions.setSelectedOrderId(123)
    );
    expect(state.selectedOrderId).toBe(123);
  });
});

describe('ordersSlice асинхронные функции', () => {
  it('feedRequest=true при загрузке', () => {
    const state = ordersReducer(undefined, { type: loadFeed.pending.type });
    expect(state.feedRequest).toBe(true);
    expect(state.feedError).toBeNull();
  });

  it('feedRequest=false при успешной загрузке', () => {
    const testPayload = {
      orders: [],
      total: 10,
      totalToday: 5
    };
    const state = ordersReducer(undefined, {
      type: loadFeed.fulfilled.type,
      payload: testPayload
    });
    expect(state.feed).toEqual(testPayload);
    expect(state.feedRequest).toBe(false);
  });

  it('feedError и feedRequest=false при ошибке', () => {
    const testError = 'Error loading feed';
    const state = ordersReducer(undefined, {
      type: loadFeed.rejected.type,
      payload: testError
    });
    expect(state.feedError).toBe(testError);
    expect(state.feedRequest).toBe(false);
  });
});
