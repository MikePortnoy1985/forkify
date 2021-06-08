import icons from 'url:../../img/icons.svg';

export default class View {
  data;

  render(data) {
    this.data = data;
    const markUp = this.generateMarkup();
    this.clear();
    this.parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  update(data) {
    this.data = data;
    const newMarkUp = this.generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkUp);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(this.parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, index) => {
      const currentEl = currentElements[index];

      if (!newEl.isEqualNode(currentEl) && newEl.firstChild?.nodeValue.trim() !== '') {
        currentEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(currentEl)) {
        Array.from(newEl.attributes).forEach(attr => currentEl.setAttribute(attr.name, attr.value));
      }
    });
  }

  clear() {
    this.parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markUp = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>`;
    this.clear();
    this.parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  renderError(message = this.errorMessage) {
    const markUp = `
          <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this.clear();
    this.parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  renderMessage(message = this.message) {
    const markUp = `
          <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;
    this.clear();
    this.parentElement.insertAdjacentHTML('afterbegin', markUp);
  }
}
