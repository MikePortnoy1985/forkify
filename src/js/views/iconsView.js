import icons from 'url:../../img/icons.svg';

class Icon {
  render(parentEl) {
    const { element, id } = parentEl;
    const markUp = this.renderMarkup(id);
    element.insertAdjacentHTML('afterbegin', markUp);
  }

  renderMarkup(id) {
    return `<use href="${icons}#${id}"></use>`;
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  renderAllIcons(parentElArray) {
    parentElArray.map(item => this.render(item));
  }
}

export default new Icon();
