import * as model from './model';
import icon from './views/iconsView';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import bookmarksView from './views/bookmarksView';
import paginationView from './views/paginationView';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_TIMER } from './config';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());

    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);
    const { recipe } = model.state;
    recipeView.render(recipe);
  } catch (e) {
    console.log(``);

    recipeView.renderError(e);
  }
};

const controlIcons = function () {
  const { searchParents } = model.state;
  icon.renderAllIcons(searchParents);
};

const controlSearch = async function () {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();

    if (!query) return;
    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);

    if (model.state.search.query && !model.state.search.results.length) {
      return resultsView.renderError('Результат поиска пуст');
    }
  } catch (e) {
    console.log(`error`);
    console.log(`e`, e);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateNewServings(newServings);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.isBookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);

  if (model.state.bookmarks.length === 0)
    bookmarksView.renderMessage('Пока нет закладок. Выберите понравившейся рецепт и добавьте его');
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
  if (model.state.bookmarks.length === 0)
    bookmarksView.renderMessage('Пока нет закладок. Выберите понравившейся рецепт и добавьте его');
};

const controlAddRecipe = async function (newRecipe) {
  try {
    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (e) {
    console.log(`e`, e);
    addRecipeView.renderError(e.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  icon.addHandlerRender(controlIcons);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addPaginationHandler(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
