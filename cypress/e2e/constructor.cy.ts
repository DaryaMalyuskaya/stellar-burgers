describe('Конструктор бургера', () => {
  const BUN_NAME = 'Краторная булка N-200i';
  const MAIN_NAME = 'Мясо бессмертных моллюсков Protostomia';
  const SAUCE_NAME = 'Соус с шипами Антарианского плоскоходца';

  const BUN_SELECTOR = `[data-cy-ingredient="${BUN_NAME}"]`;
  const MAIN_SELECTOR = `[data-cy-ingredient="${MAIN_NAME}"]`;
  const SAUCE_SELECTOR = `[data-cy-ingredient="${SAUCE_NAME}"]`;

  const CONSTRUCTOR_BUN_TOP_SELECTOR = '[data-cy="constructor-bun-top"]';
  const CONSTRUCTOR_BUN_BOTTOM_SELECTOR = '[data-cy="constructor-bun-bottom"]';
  const CONSTRUCTOR_FILLINGS_SELECTOR = '[data-cy="constructor-fillings"]';
  const PLACE_ORDER_BUTTON_SELECTOR = '.button.button_type_primary';

  const MODAL_SELECTOR = '[data-cy-modal]';
  const MODAL_OVERLAY_SELECTOR = '[data-cy-modal-overlay]';
  const MODAL_CLOSE_BUTTON_SELECTOR = '[data-cy="modal-close-button"]';
  const MODAL_INGREDIENT_NAME_SELECTOR = '[data-cy="modal-ingredient-name"]';
  const MODAL_ORDER_NUMBER_SELECTOR = '[data-cy="modal-order-number"]';

  const addIngredientToConstructor = (ingredientSelector: string) => {
    cy.get(ingredientSelector).find('button').click();
  };

  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Ингредиенты', () => {
    it('Отображение ингредиентов', () => {
      cy.get(BUN_SELECTOR).should('contain.text', BUN_NAME);
      cy.get(MAIN_SELECTOR).should('contain.text', MAIN_NAME);
    });

    it('Добавление булочки', () => {
      addIngredientToConstructor(BUN_SELECTOR);
      cy.get(CONSTRUCTOR_BUN_TOP_SELECTOR).should('contain.text', BUN_NAME);
      cy.get(CONSTRUCTOR_BUN_BOTTOM_SELECTOR).should('contain.text', BUN_NAME);
    });

    it('Добавление начинки', () => {
      addIngredientToConstructor(BUN_SELECTOR);
      addIngredientToConstructor(MAIN_SELECTOR);
      cy.get(CONSTRUCTOR_FILLINGS_SELECTOR)
        .find(`[data-cy-constructor-item-name="${MAIN_NAME}"]`)
        .should('exist');
    });

    it('Добавление булочки и нескольких начинок', () => {
      addIngredientToConstructor(BUN_SELECTOR);
      addIngredientToConstructor(MAIN_SELECTOR);
      addIngredientToConstructor(SAUCE_SELECTOR);

      cy.get(CONSTRUCTOR_BUN_TOP_SELECTOR).should('contain.text', BUN_NAME);
      cy.get(CONSTRUCTOR_BUN_BOTTOM_SELECTOR).should('contain.text', BUN_NAME);
      cy.get(CONSTRUCTOR_FILLINGS_SELECTOR)
        .find(`[data-cy-constructor-item-name="${MAIN_NAME}"]`)
        .should('exist');
      cy.get(CONSTRUCTOR_FILLINGS_SELECTOR)
        .find(`[data-cy-constructor-item-name="${SAUCE_NAME}"]`)
        .should('exist');
      cy.get(CONSTRUCTOR_FILLINGS_SELECTOR).children().should('have.length', 2);
    });
  });

  describe('Модалка ингредиента', () => {
    beforeEach(() => {
      cy.get(MAIN_SELECTOR).should('exist');
    });

    it('Корректное отображение и закрытие', () => {
      cy.get(MAIN_SELECTOR).click();

      cy.get(MODAL_SELECTOR).should('exist');
      cy.get(MODAL_INGREDIENT_NAME_SELECTOR).should('contain.text', MAIN_NAME);

      cy.get(MODAL_CLOSE_BUTTON_SELECTOR).click();
      cy.get(MODAL_SELECTOR).should('not.exist');
    });

    it('Закрытие по оверлею', () => {
      cy.get(MAIN_SELECTOR).click();

      cy.get(MODAL_SELECTOR).should('exist');
      cy.get(MODAL_OVERLAY_SELECTOR).click({ force: true });
      cy.get(MODAL_SELECTOR).should('not.exist');
    });

    it('Закрытие по escape', () => {
      cy.get(MAIN_SELECTOR).click();
      cy.get(MODAL_SELECTOR).should('exist');
      cy.get('body').type('{esc}');
      cy.get(MODAL_SELECTOR).should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.window().then((win) => {
        win.localStorage.setItem('accessToken', 'access_token');
      });
      cy.setCookie('refreshToken', 'refresh_token');

      cy.intercept('GET', '**/api/auth/user', { fixture: 'user' }).as(
        'getUserData'
      );

      cy.intercept('POST', '**/api/orders', {
        fixture: 'order.json'
      }).as('createOrder');
    });

    it('Создание заказа, отображение модалки и очищение конструктора', () => {
      addIngredientToConstructor(BUN_SELECTOR);
      addIngredientToConstructor(MAIN_SELECTOR);
      addIngredientToConstructor(SAUCE_SELECTOR);

      cy.get(CONSTRUCTOR_BUN_TOP_SELECTOR).should('contain.text', BUN_NAME);
      cy.get(CONSTRUCTOR_FILLINGS_SELECTOR).children().should('have.length', 2);

      cy.get(PLACE_ORDER_BUTTON_SELECTOR).click();

      cy.wait('@createOrder').then((interception) => {
        expect(interception.request.body.ingredients).to.be.an('array').and.not
          .be.empty;
      });

      cy.get(MODAL_SELECTOR).should('exist');
      cy.fixture('order.json').then((orderData) => {
        cy.get(MODAL_ORDER_NUMBER_SELECTOR).should(
          'contain.text',
          orderData.order.number.toString()
        );
      });

      cy.get(MODAL_CLOSE_BUTTON_SELECTOR).click();
      cy.get(MODAL_SELECTOR).should('not.exist');

      cy.get(CONSTRUCTOR_FILLINGS_SELECTOR)
        .find('div')
        .children()
        .should('have.length', 0);
    });

    afterEach(() => {
      cy.clearLocalStorage('accessToken');
      cy.clearCookie('refreshToken');
    });
  });
});
