import { loginUser, userReducer, userSlice } from '../user';

describe('userSlice', () => {
  it('isAuthChecked', () => {
    const state = userReducer(undefined, userSlice.actions.authChecked());
    expect(state.isAuthChecked).toBe(true);
  });

  it('проверка userLogout', () => {
    const prevState = {
      ...userReducer(undefined, { type: '' }),
      data: { name: 'John', email: 'john@example.com' }
    };

    const state = userReducer(prevState, userSlice.actions.userLogout());
    expect(state.data).toBeNull();
  });
});

describe('userSlice асинхронные функции', () => {
  it('loginUserRequest=true при загрузке', () => {
    const state = userReducer(undefined, { type: loginUser.pending.type });
    expect(state.loginUserRequest).toBe(true);
    expect(state.loginUserError).toBeNull();
  });

  it('user при успешной загрузке', () => {
    const user = { email: 'test@example.com', name: 'Tester' };
    const state = userReducer(undefined, {
      type: loginUser.fulfilled.type,
      payload: user
    });
    expect(state.data).toEqual(user);
    expect(state.loginUserRequest).toBe(false);
    expect(state.isAuthenticated).toBe(true);
  });

  it('loginUserError при ошибке', () => {
    const error = { message: 'Invalid login' };
    const state = userReducer(undefined, {
      type: loginUser.rejected.type,
      error
    });
    expect(state.loginUserRequest).toBe(false);
    expect(state.loginUserError).toEqual(error);
  });
});
