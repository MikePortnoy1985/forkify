class SearchView {
  parentEl = document.querySelector('.search');

  getQuery() {
    const query = document.querySelector('.search__field').value;
    this.clearInput();
    return query;
  }

  clearInput() {
    document.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this.parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
