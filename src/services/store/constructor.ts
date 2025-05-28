import { TConstructorState, TIngredient } from '@utils-types';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { v4 as uuidv4 } from 'uuid';

const initialState: TConstructorState = {
  items: {
    bun: null,
    ingredients: []
  },
  ingredients: [],
  ingredientsRequest: false,
  selectedIngredient: null
};

export const loadIngredients = createAsyncThunk(
  'constructor/loadIngredients',
  async () => await getIngredientsApi()
);

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  selectors: {
    selectSelection: (state) => state.items,
    selectIngredients: (state) => state.ingredients,
    selectIngredientsRequest: (state) => state.ingredientsRequest,
    selectSelectedIngredient: (state) =>
      state.ingredients.find((it) => it._id === state.selectedIngredient) ??
      null
  },
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      if (action.payload.type === 'bun') {
        state.items.bun = { ...action.payload, id: 'bun' };
      } else {
        state.items.ingredients.push({
          ...action.payload,
          id: uuidv4()
        });
      }
    },
    deleteIngredient: (state, action: PayloadAction<string>) => {
      state.items.ingredients = state.items.ingredients.filter(
        (it) => it.id !== action.payload
      );
    },
    moveUpIngredient: (state, action: PayloadAction<string>) => {
      const ingredientIdToMove = action.payload;
      const ingredients = state.items.ingredients;
      const index = ingredients.findIndex(
        (ing) => ing.id === ingredientIdToMove
      );

      if (index > 0) {
        const temp = ingredients[index];
        ingredients[index] = ingredients[index - 1];
        ingredients[index - 1] = temp;
      }
    },
    moveDownIngredient: (state, action: PayloadAction<string>) => {
      const ingredientIdToMove = action.payload;
      const ingredients = state.items.ingredients;
      const index = ingredients.findIndex(
        (ing) => ing.id === ingredientIdToMove
      );

      if (index !== -1 && index < ingredients.length - 1) {
        const temp = ingredients[index];
        ingredients[index] = ingredients[index + 1];
        ingredients[index + 1] = temp;
      }
    },
    selectIngredient: (state, action: PayloadAction<string | null>) => {
      state.selectedIngredient = action.payload;
    },
    clearConstructor: (state) => {
      state.items = {
        bun: null,
        ingredients: []
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadIngredients.pending, (state) => {
        state.ingredientsRequest = true;
      })
      .addCase(loadIngredients.fulfilled, (state, action) => {
        state.ingredientsRequest = false;
        state.ingredients = action.payload;
      });
  }
});

export const constructorReducer = constructorSlice.reducer;
