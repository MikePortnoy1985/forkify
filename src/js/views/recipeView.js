import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';
import View from './view';

class RecipeView extends View {
  parentElement = document.querySelector('.recipe');
  errorMessage = 'Некорректный ID рецепта';
  message = '';

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(item => window.addEventListener(item, handler));
  }

  addHandlerUpdateServings(handler) {
    this.parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      const updateTo = +btn.dataset.updateTo;
      if (updateTo > 0) handler(updateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    this.parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  generateMarkup() {
    return `
    <figure class="recipe__fig">
    <img src="${this.data.image}" alt="${this.data.title}" class="recipe__img" />
    <h1 class="recipe__title">
      <span>${this.data.title}</span>
    </h1>
    </figure>

    <div class="recipe__details">
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-clock"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--minutes">${this.data.cookingTime}</span>
      <span class="recipe__info-text">минут(-ы)</span>
    </div>
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-users"></use>
      </svg>
      <span class="recipe__info-text">сколько персон</span>
      <span class="recipe__info-data recipe__info-data--people">${this.data.servings}</span>

      <div class="recipe__info-buttons">
        <button class="btn--tiny btn--update-servings" data-update-to="${this.data.servings - 1}">
          <svg>
            <use href="${icons}#icon-minus-circle"></use>
          </svg>
        </button>
        <button class="btn--tiny btn--update-servings" data-update-to="${this.data.servings + 1}">
          <svg>
            <use href="${icons}#icon-plus-circle"></use>
          </svg>
        </button>
      </div>
    </div>

    <div class="recipe__user-generated ${this.data.key ? '' : 'hidden'}">
      <svg>
        <use href="${icons}#icon-user"></use>
      </svg>
    </div>
    <button class="btn--round btn--bookmark">
      <svg class="">
        <use href="${icons}#icon-bookmark${this.data.isBookmarked ? '-fill' : ''}"></use>
      </svg>
    </button>
    </div>

    <div class="recipe__ingredients">
    <h2 class="heading--2">ингредиенты</h2>
    <ul class="recipe__ingredient-list">
      ${this.data.ingredients.map(item => this.generateMarkupIngridients(item)).join('')}
    </ul>
    </div>
    <div class="recipe__directions">
    <h2 class="heading--2">Как это приготовить</h2>
    <p class="recipe__directions-text">
      Рецепт был оформлен и опробован
      <span class="recipe__publisher">${this.data.publisher}</span>. Перейти на их сайт по ссылке ниже.
    </p>
    <a
      class="btn--small recipe__btn"
      href="${this.data.sourceUrl}"
      target="_blank"
    >
      <span>ссылка</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </a>
    </div>`;
  }

  generateMarkupIngridients(ingridient) {
    return `
            <li class="recipe__ingredient">
                <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
                </svg>
                <div class="recipe__quantity">${
                  ingridient.quantity ? new Fraction(ingridient.quantity).toString() : ''
                }</div>
                <div class="recipe__description">
                <span class="recipe__unit">${ingridient.unit}</span>${ingridient.description}
                </div>
            </li>`;
  }
}

export default new RecipeView();
