import View from './view';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  parentElement = document.querySelector('.pagination');

  addPaginationHandler(handler) {
    this.parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goTo = +btn.dataset.goto;
      handler(goTo);
    });
  }

  generateMarkup() {
    const { results, resultsPerPage, page } = this.data;
    const numPages = Math.ceil(results.length / resultsPerPage);

    if (page === 1 && numPages > 1) {
      return `
        <button data-goto='${page + 1}' class="btn--inline pagination__btn--next">
            <span>Page: ${page + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button> 
      `;
    }

    if (page === numPages && numPages > 1) {
      return `
        <button data-goto='${page - 1}' class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page: ${page - 1}</span>
        </button>
      `;
    }

    if (page < numPages) {
      return `
        <button data-goto='${page - 1}' class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page: ${page - 1}</span>
        </button>
        <button data-goto='${page + 1}' class="btn--inline pagination__btn--next">
            <span>Page: ${page + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button> 
      `;
    }

    return '';
  }
}

export default new PaginationView();
