import { rootReducer } from '../index';
import { Action } from '@reduxjs/toolkit';

describe('rootReducer', () => {
  it('корректное состояние при передаче неизвестного action', () => {
    const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' } as Action);

    expect(result.userSlice).toBeDefined();
    expect(result.constructorSlice).toBeDefined();
    expect(result.ordersSlice).toBeDefined();
  });
});
