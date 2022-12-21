import {
  addTag,
  removeTag,
  renderTags,
  getTag,
  setStore,
  getStore,
  getNotify,
  setNotify,
} from "./store.js";
const data = "/data/recipes.json";

const onClick = (value) => {
  console.log("test");
  console.log(value);
  addTag("INGREDIENT", value);
  renderTags(
    ingredientsTags,
    getStore("INGREDIENT")[0],
    "ingredient",
    onClick,
    getTag("INGREDIENT")
  );
};

// checks if ingredient {check} is already present
const checkDouble = (allIngredient, check) => {
  let result = false;
  allIngredient.forEach((ingredient) => {
    if (ingredient.name.toLowerCase() == check.toLowerCase()) {
      result = true;
      return;
    }
  });
  return result;
};

const extractIngredient = (ingredientSet) => {
  let allIngredient = [];
  let currentId = 0;

  ingredientSet.forEach((set) => {
    set.forEach((_set) => {
      currentId = _set.id;
      _set.ingredients.forEach((ingredient) => {
        // console.log(ingredient);
        if (checkDouble(allIngredient, ingredient.ingredient) == false) {
          allIngredient.push({ id: currentId, name: ingredient.ingredient });
        }
      });
    });
  });
  return allIngredient;
};

const test = () => {
  console.log("haha");
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

    // console.log(ingredientSet);
    console.log("here");
    console.log(ingredients);

    // we need to provide the index as id to avoid duplicate ids
    ingredientLen = ingredients.length;
    renderTags(
      ingredientsTags,
      getStore("INGREDIENT")[0],
      "ingredient",
      onClick,
      getTag("INGREDIENT")
    );
    setInterval(() => {
      if (!getNotify("INGREDIENT")) return;
      renderTags(
        ingredientsTags,
        getStore("INGREDIENT")[0],
        "ingredient",
        onClick,
        getTag("INGREDIENT")
      );
      setNotify("INGREDIENT", false);
    }, 100);
  } catch (error) {
    console.error(`Could not get recipes: ${error}`);
  }
})();
