import {
  addTag,
  removeTag,
  renderTags,
  getTag,
  setStore,
  getStore,
  getNotify,
  setNotify,
  pendingTagRender,
  getView,
  filterView,
} from "./store.js";
const data = "/data/recipes.json";

const onClick = (value) => {
  addTag("INGREDIENT", value);
  pendingTagRender.setNotify("INGREDIENT", true);
};

window.setInterval(() => {
  if (!pendingTagRender.getNotify("INGREDIENT")) return;
  renderTags(
    ingredientsTags,
    getStore("INGREDIENT")[0],
    "ingredient",
    onClick,
    filterView(getView(), "INGREDIENT")
  );
  pendingTagRender.setNotify("INGREDIENT", false);
}, 2);

// checks if ingredient check is already present
const checkDouble = (allIngredient, check) => {
  let result = false;
  for (let i = 0; i < allIngredient.length; i++) {
    let ingredient = allIngredient[i];
    if (ingredient.name.toLowerCase() == check.toLowerCase()) {
      result = true;
      break;
    }
  }
  return result;
};

const extractIngredient = (ingredientSet) => {
  let allIngredient = [];
  let currentId = 0;

  ingredientSet.forEach((set) => {
    set.forEach((_set) => {
      currentId = _set.id;
      _set.ingredients.forEach((ingredient) => {
        if (checkDouble(allIngredient, ingredient.ingredient) == false) {
          allIngredient.push({ id: currentId, name: ingredient.ingredient });
        }
      });
    });
  });
  return allIngredient;
};

let ingredientLen = -1;
const ingredientsTags = document.querySelector("#ingredientCard");
(async function fetchRecipes() {
  try {
    // after this line, our function will wait for the `fetch()` call to be settled
    // the `fetch()` call will either return a Response or throw an error
    const response = await fetch(data);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    // after this line, our function will wait for the `response.json()` call to be settled
    // the `response.json()` call will either return the JSON object or throw an error
    // <p>${test()}:${recipe.quantity} ${recipe.unit}</p>
    const recipes = await response.json();
    // console.log(recipes);
    const ingredientSet = new Set();
    ingredientSet.add(recipes);
    const ingredients = extractIngredient(ingredientSet);
    setStore("INGREDIENT", ingredients);

    ingredientLen = ingredients.length;
    renderTags(
      ingredientsTags,
      getStore("INGREDIENT")[0],
      "ingredient",
      onClick,
      getTag("INGREDIENT")
    );
  } catch (error) {
    console.error(`Could not get recipes: ${error}`);
  }
})();
