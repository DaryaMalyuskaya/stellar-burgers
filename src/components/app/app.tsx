import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import React, { useCallback, useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { checkUserAuth } from '../../services/store/user';

const App = () => {
  const location = useLocation();
  const state = location.state as { background?: Location };
  const background = state?.background;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  const handleModalClose = useCallback(() => {
    if (background) {
      navigate(background.pathname + background.search, {
        replace: true,
        state: {}
      });
    } else {
      navigate(-1);
    }
  }, [background]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        <Route
          path='/login'
          element={<ProtectedRoute onlyUnAuth children={<Login />} />}
        />
        <Route
          path='/register'
          element={<ProtectedRoute onlyUnAuth children={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<ProtectedRoute onlyUnAuth children={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<ProtectedRoute onlyUnAuth children={<ResetPassword />} />}
        />

        <Route
          path='/profile'
          element={<ProtectedRoute children={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRoute children={<ProfileOrders />} />}
        />
        {/*<Route*/}
        {/*  path='/profile/orders/:number'*/}
        {/*  element={<ProtectedRoute children={<OrderInfo />} />}*/}
        {/*/>*/}

        {/*<Route path='/ingredients/:id' element={<IngredientDetails />} />*/}
        {/*<Route path='/feed/:number' element={<OrderInfo />} />*/}

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title='Информация о заказе' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute
                children={
                  <Modal title='Информация о заказе' onClose={handleModalClose}>
                    <OrderInfo />
                  </Modal>
                }
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};
export default App;
