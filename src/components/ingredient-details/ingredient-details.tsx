import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import {
  constructorSelectors,
  useDispatch,
  useSelector
} from '../../services/store';
import {
  constructorSlice,
  loadIngredients
} from '../../services/store/constructor';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadIngredients());
  }, []);
  useEffect(() => {
    dispatch(constructorSlice.actions.selectIngredient(id ?? null));
    return () => {
      dispatch(constructorSlice.actions.selectIngredient(null));
    };
  }, [id]);

  const ingredientData = useSelector(
    constructorSelectors.selectSelectedIngredient
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
