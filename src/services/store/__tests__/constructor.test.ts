import {
  constructorReducer,
  constructorSlice,
  loadIngredients
} from '../constructor';
import { TIngredient } from '@utils-types';

jest.mock('uuid', () => ({
  v4: () => 'mock-id'
}));

const testIngredient: TIngredient = {
  _id: '1',
  name: 'Test',
  type: 'sauce',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 0,
  image: '',
  image_mobile: '',
  image_large: ''
};

const bunIngredient = {
  ...testIngredient,
  type: 'bun'
};

describe('constructorReducer', () => {
  it('работа addIngredient', () => {
    const state = constructorReducer(
      undefined,
      constructorSlice.actions.addIngredient(testIngredient)
    );
    expect(state.items.ingredients).toHaveLength(1);
    expect(state.items.ingredients[0].id).toBe('mock-id');
  });

  it('работа deleteIngredient', () => {
    const withIngredient = constructorReducer(
      undefined,
      constructorSlice.actions.addIngredient(testIngredient)
    );
    const state = constructorReducer(
      withIngredient,
      constructorSlice.actions.deleteIngredient('mock-id')
    );
    expect(state.items.ingredients).toHaveLength(0);
  });

  it('работа moveUpIngredient', () => {
    const initial = {
      ...constructorReducer(undefined, { type: '' }),
      items: {
        bun: null,
        ingredients: [
          { ...testIngredient, id: '1' },
          { ...testIngredient, id: '2' }
        ]
      }
    };
    const state = constructorReducer(
      initial,
      constructorSlice.actions.moveUpIngredient('2')
    );
    expect(state.items.ingredients[0].id).toBe('2');
    expect(state.items.ingredients[1].id).toBe('1');
  });

  it('работа moveDownIngredient', () => {
    const initial = {
      ...constructorReducer(undefined, { type: '' }),
      items: {
        bun: null,
        ingredients: [
          { ...testIngredient, id: '1' },
          { ...testIngredient, id: '2' }
        ]
      }
    };
    const state = constructorReducer(
      initial,
      constructorSlice.actions.moveDownIngredient('1')
    );
    expect(state.items.ingredients[0].id).toBe('2');
    expect(state.items.ingredients[1].id).toBe('1');
  });

  it('работа addIngredient с булочкой', () => {
    const state = constructorReducer(
      undefined,
      constructorSlice.actions.addIngredient(bunIngredient)
    );
    expect(state.items.bun).toEqual({ ...bunIngredient, id: 'bun' });
  });

  it('работа selectIngredient', () => {
    const state = constructorReducer(
      undefined,
      constructorSlice.actions.selectIngredient('1')
    );
    expect(state.selectedIngredient).toBe('1');
  });

  it('работа clearConstructor', () => {
    const filledState = {
      ...constructorReducer(undefined, { type: '' }),
      items: {
        bun: { ...bunIngredient, id: 'bun' },
        ingredients: [{ ...testIngredient, id: 'mock-id' }]
      }
    };

    const cleared = constructorReducer(
      filledState,
      constructorSlice.actions.clearConstructor()
    );

    expect(cleared.items.bun).toBeNull();
    expect(cleared.items.ingredients).toEqual([]);
  });

  it('работа selectSelectedIngredient', () => {
    const state = {
      ingredients: [testIngredient],
      selectedIngredient: '1',
      items: { bun: null, ingredients: [] },
      ingredientsRequest: false
    };

    const selected = constructorSlice.selectors.selectSelectedIngredient({
      constructor: state
    });
    expect(selected?._id).toBe('1');
  });

  it('работа selectSelectedIngredient при не найденном ингредиенте', () => {
    const state = {
      ingredients: [],
      selectedIngredient: '999',
      items: { bun: null, ingredients: [] },
      ingredientsRequest: false
    };

    const selected = constructorSlice.selectors.selectSelectedIngredient({
      constructor: state
    });
    expect(selected).toBeNull();
  });
});

describe('constructorSlice асинхронные функции', () => {
  const testIngredients: TIngredient[] = [testIngredient];

  it('ingredientsRequest=true при загрузке', () => {
    const state = constructorReducer(undefined, {
      type: loadIngredients.pending.type
    });
    expect(state.ingredientsRequest).toBe(true);
  });

  it('ingredients и ingredientsRequest=false при успешной загрузке', () => {
    const state = constructorReducer(undefined, {
      type: loadIngredients.fulfilled.type,
      payload: testIngredients
    });
    expect(state.ingredients).toEqual(testIngredients);
    expect(state.ingredientsRequest).toBe(false);
  });
});
