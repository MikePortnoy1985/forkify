import { async } from 'regenerator-runtime';
import { API_URL, RESULTS_PER_PAGE, KEY } from './config';
import { getJSON, sendJSON } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RESULTS_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
  searchParents: [
    { element: document.querySelector('.search__icon'), id: 'icon-search' },
    { element: document.querySelector('.nav__icon__a'), id: 'icon-edit' },
    { element: document.querySelector('.nav__icon__b'), id: 'icon-bookmark' },
    { element: document.querySelector('.smile__icon__a'), id: 'icon-smile' },
    { element: document.querySelector('.smile__icon__b'), id: 'icon-smile' },
    { element: document.querySelector('.upload__btn__icon'), id: 'icon-upload-cloud' },
  ],
};

const formatRecipe = function (recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const result = await getJSON(`${API_URL}/${id}?key=${KEY}`);
    const { recipe } = result;
    state.recipe = formatRecipe(recipe);

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.isBookmarked = true;
    } else {
      state.recipe.isBookmarked = false;
    }
  } catch (e) {
    throw e;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const result = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = result.recipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      ...(recipe.key && { key: recipe.key }),
    }));
    state.search.page = 1;
  } catch (e) {
    throw e;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateNewServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.isBookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.isBookmarked = false;

  persistBookmarks();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3) throw new Error(' Неправильный формат ингредиентов');
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const response = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = formatRecipe(response.recipe);
    addBookmark(state.recipe);
  } catch (e) {
    throw e;
  }
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (!storage) return;
  state.bookmarks = JSON.parse(storage);
};

init();
